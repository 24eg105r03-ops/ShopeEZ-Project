const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all products for logged-in seller
// @route   GET /api/seller/products
// @access  Private (Seller only)
const getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json(products);
};

// @desc    Get all orders containing this seller's products
// @route   GET /api/seller/orders
// @access  Private (Seller only)
const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/seller/orders/:id/status
// @access  Private (Seller only)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ensure this order has items sold by this seller
  const sellsItem = order.items.some((i) => i.seller.toString() === req.user._id.toString());
  if (!sellsItem) {
    return res.status(403).json({ message: 'Not authorized to update status for this order' });
  }

  order.status = status;
  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.isPaid = true; // Delivered COD gets marked paid
    order.paidAt = order.paidAt || Date.now();
  }
  
  await order.save();
  res.json(order);
};

// @desc    Get seller shop analytics
// @route   GET /api/seller/analytics
// @access  Private (Seller only)
const getSellerAnalytics = async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  const orders = await Order.find({ 'items.seller': req.user._id });

  let totalRevenue = 0;
  let totalUnitsSold = 0;
  const salesByProduct = {};
  
  orders.forEach((order) => {
    order.items
      .filter((item) => item.seller.toString() === req.user._id.toString())
      .forEach((item) => {
        const itemRev = item.price * item.qty;
        totalRevenue += itemRev;
        totalUnitsSold += item.qty;
        salesByProduct[item.name] = (salesByProduct[item.name] || 0) + item.qty;
      });
  });

  const lowStock = products
    .filter((p) => p.countInStock <= 5)
    .map((p) => ({ name: p.name, countInStock: p.countInStock }));

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: +totalRevenue.toFixed(2),
    totalUnitsSold,
    salesByProduct,
    lowStock,
  });
};

module.exports = {
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
};
