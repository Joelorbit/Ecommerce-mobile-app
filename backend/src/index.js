require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');

app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
