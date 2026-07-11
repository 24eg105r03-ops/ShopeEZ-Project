const Product = require('../models/Product');

// @desc    Fetch all products with sorting, filtering, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  const query = {};
  
  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }
  
  if (category) {
    query.category = category;
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting query logic
  let sortQuery = { createdAt: -1 }; // default: newest
  if (sort === 'price-asc') {
    sortQuery = { price: 1 };
  } else if (sort === 'price-desc') {
    sortQuery = { price: -1 };
  } else if (sort === 'rating') {
    sortQuery = { rating: -1 };
  } else if (sort === 'newest') {
    sortQuery = { createdAt: -1 };
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('seller', 'name email')
    .sort(sortQuery)
    .limit(Number(limit))
    .skip(Number(limit) * (Number(page) - 1));

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(count / limit),
    total: count,
  });
};

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name email');
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Seller only)
const createProduct = async (req, res) => {
  const { name, description, image, category, price, discountPercent, countInStock } = req.body;
  const product = await Product.create({
    seller: req.user._id,
    name,
    description,
    image,
    category,
    price: Number(price),
    discountPercent: Number(discountPercent || 0),
    countInStock: Number(countInStock),
  });
  res.status(201).json(product);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Seller only, own product)
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this product' });
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller only, own product)
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this product' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed successfully' });
};

// @desc    Create new product review
// @route   POST /api/products/:id/reviews
// @access  Private (Buyer/Registered)
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    return res.status(400).json({ message: 'Product already reviewed' });
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
