const { Router } = require('express');
const { supabase } = require('../supabase');

const router = Router();

// ─── In-memory fallback ───────────────────────────────────────────────────────
let mockProducts = [
  { id: 1, name: 'Premium Wireless Headphones', description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium comfort fit.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', price: 149.99, category: 'Electronics' },
  { id: 2, name: 'Smart Watch Pro', description: 'Advanced smartwatch with heart rate monitoring, GPS tracking, water resistance, and 7-day battery life.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', price: 299.99, category: 'Electronics' },
  { id: 3, name: 'Portable Bluetooth Speaker', description: 'Waterproof portable speaker with 360-degree sound, 12-hour playtime, and built-in microphone.', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', price: 79.99, category: 'Electronics' },
  { id: 4, name: 'Mechanical Keyboard', description: 'RGB mechanical gaming keyboard with Cherry MX switches, programmable keys, and aluminum frame.', image: 'https://images.unsplash.com/photo-1541140532154-b024d1b12f30?w=400&q=80', price: 129.99, category: 'Computing' },
  { id: 5, name: 'USB-C Hub Adapter', description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and 100W power delivery.', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80', price: 49.99, category: 'Computing' },
  { id: 6, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with precision tracking, silent clicks, and rechargeable battery.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', price: 39.99, category: 'Computing' },
  { id: 7, name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand for better ergonomics, compatible with all laptop sizes.', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80', price: 59.99, category: 'Accessories' },
  { id: 8, name: 'Wireless Charging Pad', description: 'Fast wireless charging pad with LED indicator, compatible with all Qi-enabled devices.', image: 'https://images.unsplash.com/photo-1586953208270-767889db6b3f?w=400&q=80', price: 29.99, category: 'Accessories' },
  { id: 9, name: 'Running Shoes', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper for max comfort.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', price: 89.99, category: 'Sports' },
  { id: 10, name: 'Yoga Mat', description: 'Non-slip premium yoga mat with alignment lines, extra thick for joint support.', image: 'https://images.unsplash.com/photo-1601925228429-1c95e24f7bc1?w=400&q=80', price: 34.99, category: 'Sports' },
];
let nextId = 11;

// ─── GET /products ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;

    if (supabase) {
      let query = supabase.from('products').select('*').range(Number(offset), Number(offset) + Number(limit) - 1);
      if (category) query = query.eq('category', category);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.json(data);
    }

    // Mock fallback
    let result = [...mockProducts];
    if (category) result = result.filter(p => p.category === category);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(String(search).toLowerCase()));
    res.json(result.slice(Number(offset), Number(offset) + Number(limit)));
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ─── GET /products/:id ─────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) return res.status(404).json({ error: 'Product not found' });
      return res.json(data);
    }

    const product = mockProducts.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ─── POST /products (admin) ────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, description, image, price, category } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'name and price are required' });

    if (supabase) {
      const { data, error } = await supabase.from('products').insert({ name, description, image, price, category }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    const product = { id: nextId++, name, description, image, price, category };
    mockProducts.push(product);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ─── PUT /products/:id ─────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (supabase) {
      const { data, error } = await supabase.from('products').update(req.body).eq('id', id).select().single();
      if (error) return res.status(404).json({ error: 'Product not found' });
      return res.json(data);
    }

    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    mockProducts[idx] = { ...mockProducts[idx], ...req.body };
    res.json(mockProducts[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ─── DELETE /products/:id ──────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return res.status(404).json({ error: 'Product not found' });
      return res.status(204).send();
    }

    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    mockProducts.splice(idx, 1);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
