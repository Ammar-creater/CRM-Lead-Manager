const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthMiddleware {
  async protect(req, res, next) {
    try {
      let token;
      
      
      if (req.cookies.token) {
        token = req.cookies.token;
      } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'You are not logged in. Please log in to access this resource.'
        });
      }
      
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'The user belonging to this token no longer exists.'
        });
      }
      

      if (user.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
          success: false,
          error: 'User recently changed password. Please log in again.'
        });
      }
      
    
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Your account has been deactivated. Please contact support.'
        });
      }
      
      req.user = user;
      req.userId = user._id;
      next();
      
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token. Please log in again.'
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Your token has expired. Please log in again.'
        });
      }
      
      console.error('Auth error:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication failed. Please try again.'
      });
    }
  }
  
  restrictTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to perform this action.'
        });
      }
      next();
    };
  }
}

module.exports = new AuthMiddleware();