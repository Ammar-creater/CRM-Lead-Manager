const rateLimit = require('express-rate-limit');


exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});


exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true, 
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes.'
  }
});


exports.leadCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 50,
  keyGenerator: (req) => req.userId || req.ip,
  message: {
    success: false,
    error: 'Lead creation limit reached. Please try again later.'
  }
});