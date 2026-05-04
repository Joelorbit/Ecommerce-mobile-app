const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../supabase');

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';

// ─── Mock user store (used when Supabase is not configured) ───────────────────
let mockUsers = [];
let nextUserId = 1;

function signToken(userId, email, role = 'user') {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '30d' });
}

// ─── POST /auth/register ───────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (supabase) {
      // Use Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name: full_name || '' },
        email_confirm: true,
      });
      if (error) return res.status(400).json({ error: error.message });

      // Upsert profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: full_name || '',
        role: 'user',
      });

      const token = signToken(data.user.id, email);
      return res.status(201).json({ token, user: { id: data.user.id, email, full_name, role: 'user' } });
    }

    // Mock fallback
    if (mockUsers.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: nextUserId++, email, password: hashed, full_name: full_name || '', role: 'user' };
    mockUsers.push(user);
    const token = signToken(user.id, email);
    const { password: _, ...safe } = user;
    res.status(201).json({ token, user: safe });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ─── POST /auth/login ──────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(401).json({ error: 'Invalid credentials' });

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      const token = signToken(data.user.id, email, profile?.role || 'user');
      return res.json({ token, user: { id: data.user.id, email, full_name: profile?.full_name, role: profile?.role || 'user' } });
    }

    // Mock fallback
    const user = mockUsers.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user.id, email, user.role);
    const { password: _, ...safe } = user;
    res.json({ token, user: safe });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── GET /auth/profile ─────────────────────────────────────────────────────────
router.get('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const userId = req.userId;

    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) return res.status(404).json({ error: 'Profile not found' });
      return res.json(data);
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safe } = user;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ─── PUT /auth/profile ─────────────────────────────────────────────────────────
router.put('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const userId = req.userId;
    const { full_name, avatar_url, address } = req.body;

    if (supabase) {
      const { data, error } = await supabase.from('profiles').update({ full_name, avatar_url, address }).eq('id', userId).select().single();
      if (error) throw error;
      return res.json(data);
    }

    const idx = mockUsers.findIndex(u => u.id === userId);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    mockUsers[idx] = { ...mockUsers[idx], full_name, avatar_url, address };
    const { password: _, ...safe } = mockUsers[idx];
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
