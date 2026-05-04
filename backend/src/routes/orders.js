const { Router } = require('express');
const { supabase } = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = Router();

// All orders routes require authentication
router.use(authMiddleware);

// ─── In-memory fallback ───────────────────────────────────────────────────────
let mockOrders = [];
let mockOrderItems = [];
let nextOrderId = 1;
let nextItemId = 1;

// ─── POST /orders ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { items, total, address } = req.body;
    // items: [{ product_id, quantity, price }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (supabase) {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: userId, status: 'pending', total, address })
        .select()
        .single();
      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));
      const { data: createdItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();
      if (itemsError) throw itemsError;

      return res.status(201).json({ ...order, items: createdItems });
    }

    // Mock fallback
    const order = { id: nextOrderId++, user_id: userId, status: 'pending', total, address, created_at: new Date().toISOString() };
    mockOrders.push(order);
    const createdItems = items.map(item => {
      const oi = { id: nextItemId++, order_id: order.id, ...item };
      mockOrderItems.push(oi);
      return oi;
    });
    res.status(201).json({ ...order, items: createdItems });
  } catch (err) {
    console.error('POST /orders error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// ─── GET /orders ───────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.json(data);
    }

    const orders = mockOrders
      .filter(o => o.user_id === userId)
      .map(o => ({ ...o, items: mockOrderItems.filter(i => i.order_id === o.id) }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ─── GET /orders/:id ───────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.userId;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (error) return res.status(404).json({ error: 'Order not found' });
      return res.json(data);
    }

    const order = mockOrders.find(o => o.id === id && o.user_id === userId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ...order, items: mockOrderItems.filter(i => i.order_id === id) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ─── PATCH /orders/:id/status ──────────────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) return res.status(404).json({ error: 'Order not found' });
      return res.json(data);
    }

    const idx = mockOrders.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Order not found' });
    mockOrders[idx].status = status;
    res.json(mockOrders[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
