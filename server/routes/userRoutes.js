// routes/userRoutes.js
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// GET /api/users (admin)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  res.json({ users, total, pages: Math.ceil(total / limit) });
}));

// GET /api/users/stats (admin)
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
  const [total, admins, recent] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isAdmin: true }),
    User.find().sort({ createdAt: -1 }).limit(5).select('name email avatar createdAt'),
  ]);
  res.json({ total, admins, recentUsers: recent });
}));

// GET /api/users/:id (admin)
router.get('/:id', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json(user);
}));

// PUT /api/users/:id (admin)
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
  const updated = await user.save();
  res.json(updated);
}));

// DELETE /api/users/:id (admin)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) { res.status(400); throw new Error('Cannot delete yourself'); }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
}));

module.exports = router;
