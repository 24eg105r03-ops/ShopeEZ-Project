const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, sellerOnly } = require('../middleware/auth');

// @route GET /api/seller/products - seller's own products
router.get('/products', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/seller/orders - orders containing this seller's items
router.get('/orders', protect, sellerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/seller/orders/:id/status
router.put('/orders/:id/status', protect, sellerOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/seller/analytics - dashboard stats
router.get('/analytics', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    const orders = await Order.find({ 'items.seller': req.user._id });

    let totalRevenue = 0;
    let totalUnitsSold = 0;
    const salesByProduct = {};

    orders.forEach((order) => {
      order.items
        .filter((i) => i.seller.toString() === req.user._id.toString())
        .forEach((i) => {
          totalRevenue += i.price * i.qty;
          totalUnitsSold += i.qty;
          salesByProduct[i.name] = (salesByProduct[i.name] || 0) + i.qty;
        });
    });

    const lowStock = products.filter((p) => p.countInStock <= 5).map((p) => ({ name: p.name, countInStock: p.countInStock }));

    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: +totalRevenue.toFixed(2),
      totalUnitsSold,
      salesByProduct,
      lowStock,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
