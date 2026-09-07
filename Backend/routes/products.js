const express = require('express');
const { Product } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// ─── GET all products ─────────────────────────────────────────────────────────
// Supports optional query params: ?category=&status=&search=
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { title:       { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { fiber:       { $regex: req.query.search, $options: 'i' } },
        { tags:        { $in: [new RegExp(req.query.search, 'i')] } },
      ];
    }
    const products = await Product.find(filter)
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// ─── GET single product ───────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner', 'name email avatar');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
});

// ─── POST create product ──────────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, description, images, price, status,
      category, fiber, size, condition, depot,
      method, lot, tagId, tags,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      images:    images    || [],
      price:     price     || 45,
      status:    status    || 'available',
      owner:     req.user.id,
      category:  category  || 'Heavy Outerwear',
      fiber:     fiber     || '',
      size:      size      || '',
      condition: condition || '',
      depot:     depot     || 'Cascadia Depot Hub 44-A',
      method:    method    || 'both',
      lot:       lot       || '',   // auto-generated if empty (see model pre-save)
      tagId:     tagId     || '',   // auto-generated if empty
      tags:      tags      || [],
    });

    // Award 10 points to the user for listing a garment
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10 } });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

// ─── PUT update product ───────────────────────────────────────────────────────
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Allow all editable fields
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

// ─── PUT update product images only ──────────────────────────────────────────
router.put('/:id/images', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    product.images = req.body.images;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update images', error: err.message });
  }
});

// ─── DELETE product ───────────────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;