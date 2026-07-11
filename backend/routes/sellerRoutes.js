const express = require('express');
const router = express.Router();
const {
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
} = require('../controllers/sellerController');
const { protect, sellerOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

router.use(protect);
router.use(sellerOnly);

router.get('/products', asyncHandler(getSellerProducts));
router.get('/orders', asyncHandler(getSellerOrders));
router.put('/orders/:id/status', asyncHandler(updateOrderStatus));
router.get('/analytics', asyncHandler(getSellerAnalytics));

module.exports = router;
