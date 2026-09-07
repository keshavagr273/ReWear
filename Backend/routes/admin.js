const express = require('express');
const { User, Product, Order } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// ─── Middleware: admin only ───────────────────────────────────────────────────
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// ══════════════════════════════════════════════════════════════════════════════
//  USER MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

// GET all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// GET single user
router.get('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// PUT update user (name, email, role, points)
router.put('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, email, role, points } = req.body;
    if (name   !== undefined) user.name   = name;
    if (email  !== undefined) user.email  = email;
    if (role   !== undefined) user.role   = role;
    if (points !== undefined) user.points = points;
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// DELETE user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
//  PRODUCT / LISTING MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

// GET all products (admin view — includes all statuses)
router.get('/products', auth, isAdmin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// PUT update product (admin can edit all fields)
router.put('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const editable = [
      'title', 'description', 'images', 'price', 'status',
      'category', 'fiber', 'size', 'condition', 'depot',
      'method', 'lot', 'tagId', 'tags',
    ];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

// DELETE product
router.delete('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
//  ORDER MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

// GET all orders (admin view)
router.get('/orders', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product', 'title price images status category')
      .populate('requester', 'name email')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// PUT update order status (admin)
router.put('/orders/:id', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;

    // Refund points if rejecting a redeem order
    if (req.body.status === 'rejected' && order.method === 'redeem' && order.points) {
      await User.findByIdAndUpdate(order.requester, { $inc: { points: order.points } });
      await User.findByIdAndUpdate(order.owner, { $inc: { points: -order.points } });
    }

    await order.save();
    const populated = await order.populate('product requester owner');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
});

// DELETE order
router.delete('/orders/:id', auth, isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
//  STATS / DASHBOARD SUMMARY
// ══════════════════════════════════════════════════════════════════════════════

// GET admin stats overview
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, pendingOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
    ]);
    res.json({ totalUsers, totalProducts, totalOrders, pendingOrders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

module.exports = router;