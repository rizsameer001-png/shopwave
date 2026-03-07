const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('All fields (name, email, password) are required');
  }
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    avatar: user.avatar, isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
}));

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Email and password required'); }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  if (!user.isActive) { res.status(401); throw new Error('Account deactivated, contact support'); }

  res.json({
    _id: user._id, name: user.name, email: user.email,
    avatar: user.avatar, phone: user.phone, isAdmin: user.isAdmin,
    addresses: user.addresses, wishlist: user.wishlist,
    token: generateToken(user._id),
  });
}));

// ── GET /api/auth/me ─────────────────────────────────────────────────────
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice rating');
  res.json(user);
}));

// ── PUT /api/auth/profile ────────────────────────────────────────────────
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone ?? user.phone;
  user.avatar = req.body.avatar ?? user.avatar;
  if (req.body.password) {
    if (!req.body.currentPassword || !(await user.matchPassword(req.body.currentPassword))) {
      res.status(400); throw new Error('Current password is incorrect');
    }
    user.password = req.body.password;
  }
  const updated = await user.save();
  res.json({
    _id: updated._id, name: updated.name, email: updated.email,
    avatar: updated.avatar, phone: updated.phone, isAdmin: updated.isAdmin,
    token: generateToken(updated._id),
  });
}));

// ── POST /api/auth/address ───────────────────────────────────────────────
router.post('/address', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(user.addresses);
}));

// ── PUT /api/auth/address/:id ────────────────────────────────────────────
router.put('/address/:id', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.id);
  if (!addr) { res.status(404); throw new Error('Address not found'); }
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  Object.assign(addr, req.body);
  await user.save();
  res.json(user.addresses);
}));

// ── DELETE /api/auth/address/:id ─────────────────────────────────────────
router.delete('/address/:id', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
  await user.save();
  res.json(user.addresses);
}));

// ── POST /api/auth/wishlist/:productId ──────────────────────────────────
router.post('/wishlist/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid = req.params.productId;
  const idx = user.wishlist.findIndex((id) => id.toString() === pid);
  let action;
  if (idx === -1) { user.wishlist.push(pid); action = 'added'; }
  else { user.wishlist.splice(idx, 1); action = 'removed'; }
  await user.save();
  res.json({ action, wishlist: user.wishlist });
}));

module.exports = router;
