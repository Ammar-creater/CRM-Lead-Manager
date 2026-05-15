class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  
  console.error('Error:', err);
  
 
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }
  
 
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new AppError(message, 400);
  }
  
  
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = messages.join('. ');
    error = new AppError(message, 400);
  }
  
  
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { AppError, errorHandler };