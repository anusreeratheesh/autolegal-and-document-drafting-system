const express = require('express');
const { register, signup, login, logout, refreshToken, getMe, sendOtp, sendVerificationEmail, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/send-otp', authLimiter, sendOtp);
router.post('/register', authLimiter, upload.single('barCouncilCertificate'), register);
router.post('/signup', authLimiter, upload.single('barCouncilCertificate'), register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

// Email verification routes
router.post('/send-verification-email', protect, sendVerificationEmail);
router.post('/verify-email/:token', verifyEmail);

module.exports = router;
