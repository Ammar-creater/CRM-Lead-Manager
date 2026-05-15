const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authLimiter, validateRegistration, authController.register.bind(authController));
router.post('/login', authLimiter, validateLogin, authController.login.bind(authController));

// Protected routes
router.get('/logout', auth.protect.bind(auth), authController.logout.bind(authController));
router.get('/me', auth.protect.bind(auth), authController.getMe.bind(authController));

module.exports = router;