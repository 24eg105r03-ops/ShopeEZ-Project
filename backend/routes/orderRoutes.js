const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', protect, validateOrder, asyncHandler(createOrder));
router.get('/myorders', protect, asyncHandler(getMyOrders));
router.get('/:id', protect, asyncHandler(getOrderById));

module.exports = router;
