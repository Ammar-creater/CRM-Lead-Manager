const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const dotenv = require('dotenv');


dotenv.config();


const database = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

database.connect();


app.use(helmet()); 

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());


app.use(mongoSanitize());


app.use(xss());


app.use(compression());


app.use('/api', apiLimiter);


if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot find ${req.originalUrl} on this server`
  });
});


app.use(errorHandler);


process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});


process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;