const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin, optionalAuth } = require('../middleware/auth');

// ── GET /api/products ─────────────────────────────────────────────────────
// Query: keyword, category, brand, minPrice, maxPrice, sort, page, limit, featured, isNew
router.get('/', asyncHandler(async (req, res) => {
  const { keyword, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12, featured, isNew } = req.query;

  const filter = { isActive: true };
  if (keyword) filter.$text = { $search: keyword };
  if (category) filter.category = category;
  if (brand) filter.brand = { $regex: brand, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') filter.isFeatured = true;
  if (isNew === 'true') filter.isNew = true;

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    popular: { numReviews: -1 },
  };
  const sortQuery = sortMap[sort] || { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 100);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortQuery).skip(skip).limit(limitNum).select('-reviews'),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
    hasNextPage: pageNum < Math.ceil(total / limitNum),
  });
}));

// ── GET /api/products/featured ────────────────────────────────────────────
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(10).select('-reviews');
  res.json(products);
}));

// ── GET /api/products/new-arrivals ────────────────────────────────────────
router.get('/new-arrivals', asyncHandler(async (req, res) => {
  const products = await Product.find({ isNew: true, isActive: true }).sort({ createdAt: -1 }).limit(10).select('-reviews');
  res.json(products);
}));

// ── GET /api/products/categories ─────────────────────────────────────────
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json(categories);
}));

// ── GET /api/products/:id ─────────────────────────────────────────────────
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [
      ...(req.params.id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: req.params.id }] : []),
      { slug: req.params.id },
    ],
    isActive: true,
  }).populate('reviews.user', 'name avatar');

  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
}));

// ── POST /api/products ────────────────────────────────────────────────────
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

// ── PUT /api/products/:id ─────────────────────────────────────────────────
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
}));

// ── DELETE /api/products/:id ──────────────────────────────────────────────
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Product deactivated' });
}));

// ── POST /api/products/:id/reviews ────────────────────────────────────────
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) { res.status(400); throw new Error('Rating and comment required'); }

  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) { res.status(400); throw new Error('You already reviewed this product'); }

  product.reviews.push({ user: req.user._id, name: req.user.name, avatar: req.user.avatar, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();

  res.status(201).json({ message: 'Review added', rating: product.rating, numReviews: product.numReviews });
}));

// ── GET /api/products/:id/related ────────────────────────────────────────
router.get('/:id/related', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const related = await Product.find({ category: product.category, _id: { $ne: product._id }, isActive: true }).limit(4).select('-reviews');
  res.json(related);
}));

module.exports = router;
