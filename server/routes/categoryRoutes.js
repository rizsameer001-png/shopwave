// routes/categoryRoutes.js
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  res.json(categories);
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(cat);
}));

router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cat) { res.status(404); throw new Error('Category not found'); }
  res.json(cat);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Category removed' });
}));

module.exports = router;
