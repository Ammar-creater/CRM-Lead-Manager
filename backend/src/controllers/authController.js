const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

class AuthController {
  
  signToken(id) {
    return jwt.sign(
      { id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }
  
  
  createSendToken(user, statusCode, res) {
    const token = this.signToken(user._id);
    
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    res.cookie('token', token, cookieOptions);
    
    
    user.password = undefined;
    
    res.status(statusCode).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }
  
  
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError('Email already registered', 400));
      }
      
      
      const user = await User.create({
        name,
        email,
        password,
        role: 'user'
      });
      
      this.createSendToken(user, 201, res);
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        
        if (user) await user.incrementLoginAttempts();
        
        return next(new AppError('Invalid email or password', 401));
      }
      
      
      if (user.lockUntil && user.lockUntil > Date.now()) {
        const remainingTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
        return next(new AppError(`Account locked. Try again in ${remainingTime} minutes`, 401));
      }
      
      
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
      
      this.createSendToken(user, 200, res);
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async logout(req, res, next) {
    try {
      res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.userId).select('-password');
      
      res.status(200).json({
        success: true,
        user
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();