const express = require('express');
const router = express.Router();
const {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, sellerOnly } = require('../middleware/auth');
const { validateProduct, validateReview } = require('../middleware/validation');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(getProducts));
router.get('/categories', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getProductById));

router.post('/', protect, sellerOnly, validateProduct, asyncHandler(createProduct));
router.put('/:id', protect, sellerOnly, validateProduct, asyncHandler(updateProduct));
router.delete('/:id', protect, sellerOnly, asyncHandler(deleteProduct));

router.post('/:id/reviews', protect, validateReview, asyncHandler(createProductReview));

module.exports = router;
