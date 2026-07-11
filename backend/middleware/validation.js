const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { name, category, price, countInStock } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Product name is required' });
  }
  if (!category || category.trim() === '') {
    return res.status(400).json({ message: 'Category is required' });
  }
  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: 'Price must be a positive number' });
  }
  if (countInStock === undefined || isNaN(Number(countInStock)) || Number(countInStock) < 0) {
    return res.status(400).json({ message: 'Stock must be a non-negative number' });
  }
  next();
};

const validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Review comment is required' });
  }
  next();
};

const validateOrder = (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({ message: 'Complete shipping address is required' });
  }
  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required' });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateReview,
  validateOrder,
};
