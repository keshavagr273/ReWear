const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// ─── GET current user profile ─────────────────────────────────────────────────
// Returns full user object (excluding password) including points balance
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is already populated by auth middleware (password excluded)
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// ─── PUT update current user profile ─────────────────────────────────────────
// Accepts name and/or avatar changes
router.put('/me', auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (name   !== undefined) req.user.name   = name;
    if (avatar !== undefined) req.user.avatar = avatar;
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

module.exports = router;