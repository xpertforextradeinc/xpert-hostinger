import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory order storage (replace with database in production)
const orders = new Map();

// Middleware for API Key validation
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create Order
app.post('/orders', validateApiKey, (req, res) => {
  try {
    const { customerId, items, metadata } = req.body;

    if (!customerId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const orderId = uuidv4();
    const order = {
      orderId,
      customerId,
      items,
      status: 'pending',
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.set(orderId, order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Order
app.get('/orders/:orderId', validateApiKey, (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Orders
app.get('/orders', validateApiKey, (req, res) => {
  try {
    const allOrders = Array.from(orders.values());
    res.json({ count: allOrders.length, orders: allOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order
app.patch('/orders/:orderId', validateApiKey, (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, items, metadata } = req.body;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) order.status = status;
    if (items) order.items = items;
    if (metadata) order.metadata = { ...order.metadata, ...metadata };
    order.updatedAt = new Date().toISOString();

    orders.set(orderId, order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel Order
app.post('/orders/:orderId/cancel', validateApiKey, (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    orders.set(orderId, order);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`XPERT Order API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
