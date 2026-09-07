const express = require('express');
const { Order, Product, User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// ─── POST create order (swap or redeem) ──────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { productId, method, points, requesterItem } = req.body;

    const product = await Product.findById(productId).populate('owner');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Prevent owner from swapping with themselves
    if (product.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own garment' });
    }

    // For redeem method: check the requester has enough points
    if (method === 'redeem') {
      const cost = points || product.price || 45;
      if ((req.user.points || 0) < cost) {
        return res.status(400).json({
          message: `Insufficient points. You have ${req.user.points || 0} pts, need ${cost} pts.`,
        });
      }
      // Deduct points from requester and credit to product owner
      await User.findByIdAndUpdate(req.user._id, { $inc: { points: -cost } });
      if (product.owner._id) {
        await User.findByIdAndUpdate(product.owner._id, { $inc: { points: cost } });
      }
    }

    const order = await Order.create({
      product:       product._id,
      requester:     req.user._id,
      owner:         product.owner._id || product.owner,
      method,
      points:        method === 'redeem' ? (points || product.price || 45) : undefined,
      requesterItem: method === 'swap'   ? requesterItem : undefined,
    });

    // Mark product as sold/reserved once an order is placed (optional — keeps status clean)
    // product.status = method === 'redeem' ? 'sold' : 'swap';
    // await product.save();

    const populated = await order.populate('product requester owner');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// ─── GET all orders (admin only) ──────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
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

// ─── GET my orders (authenticated user) ──────────────────────────────────────
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ requester: req.user._id })
      .populate('product', 'title price images status category')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your orders', error: err.message });
  }
});

// ─── PUT update order status (admin or owner of the product) ─────────────────
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isAdmin        = req.user.role === 'admin';
    const isProductOwner = req.user._id.toString() === order.owner.toString();
    if (!isAdmin && !isProductOwner) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = req.body.status;

    // If rejecting a redeem order — refund points to requester and deduct from owner
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

module.exports = router;