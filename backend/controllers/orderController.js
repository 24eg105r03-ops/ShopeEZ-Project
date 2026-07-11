const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private (Buyer)
const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product ${item.productId} not found` });
    }
    if (product.countInStock < item.qty) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
    
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.finalPrice, // Virtual getter handles discount
      qty: item.qty,
      seller: product.seller,
    });

    product.countInStock -= item.qty;
    await product.save();
  }

  const itemsPrice = orderItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const totalPrice = +(itemsPrice + shippingPrice).toFixed(2);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod !== 'Cash on Delivery',
    paidAt: paymentMethod !== 'Cash on Delivery' ? Date.now() : undefined,
  });

  res.status(201).json(order);
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const isBuyer = order.user._id.toString() === req.user._id.toString();
  const isSeller = req.user.role === 'seller';
  
  if (!isBuyer && !isSeller) {
    return res.status(403).json({ message: 'Not authorized to view this order' });
  }

  res.json(order);
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
