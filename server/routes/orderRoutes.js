const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// ── POST /api/orders ──────────────────────────────────────────────────────
router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, couponCode, notes } = req.body;
  if (!items?.length) { res.status(400); throw new Error('No order items'); }

  // Validate stock
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) { res.status(404); throw new Error(`Product ${item.name} not found`); }
    if (product.stock < item.quantity) { res.status(400); throw new Error(`Insufficient stock for ${product.name}`); }
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'Credit Card',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    couponCode,
    notes,
    statusHistory: [{ status: 'Pending', note: 'Order placed' }],
  });

  // Deduct stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  res.status(201).json(order);
}));

// ── GET /api/orders/my ────────────────────────────────────────────────────
router.get('/my', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  res.json({ orders, total, pages: Math.ceil(total / limit) });
}));

// ── GET /api/orders/stats (admin) ─────────────────────────────────────────
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
  const [totalRevenue, totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ['Pending', 'Processing'] } }),
    Order.countDocuments({ status: 'Delivered' }),
  ]);
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');
  res.json({
    revenue: totalRevenue[0]?.total || 0,
    total: totalOrders,
    pending: pendingOrders,
    delivered: deliveredOrders,
    recentOrders,
  });
}));

// ── GET /api/orders (admin) ───────────────────────────────────────────────
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.orderNumber = { $regex: search, $options: 'i' };

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  res.json({ orders, total, pages: Math.ceil(total / limit) });
}));

// ── GET /api/orders/:id ───────────────────────────────────────────────────
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email avatar');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403); throw new Error('Not authorized to view this order');
  }
  res.json(order);
}));

// ── PUT /api/orders/:id/pay ───────────────────────────────────────────────
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403); throw new Error('Not authorized');
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'Confirmed';
  order.paymentResult = { id: req.body.id, status: req.body.status, updateTime: req.body.update_time, emailAddress: req.body.email };
  order.statusHistory.push({ status: 'Confirmed', note: 'Payment confirmed' });
  const updated = await order.save();
  res.json(updated);
}));

// ── PUT /api/orders/:id/status (admin) ───────────────────────────────────
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.status = status;
  if (status === 'Delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
  const updated = await order.save();
  res.json(updated);
}));

// ── DELETE /api/orders/:id (admin) ────────────────────────────────────────
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  await order.deleteOne();
  res.json({ message: 'Order deleted' });
}));

module.exports = router;
