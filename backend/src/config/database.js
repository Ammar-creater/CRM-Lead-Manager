const mongoose = require('mongoose');

class Database {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(process.env.MONGODB_URI, options);
      
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    if (!this.isConnected) return;
    
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('Database disconnected');
  }
}

module.exports = new Database();