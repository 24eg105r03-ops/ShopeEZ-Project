const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const asyncHandler = require('../utils/asyncHandler');

router.post('/register', validateRegister, asyncHandler(registerUser));
router.post('/login', validateLogin, asyncHandler(loginUser));
router.get('/me', protect, asyncHandler(getUserProfile));
router.put('/profile', protect, asyncHandler(updateUserProfile));

module.exports = router;
