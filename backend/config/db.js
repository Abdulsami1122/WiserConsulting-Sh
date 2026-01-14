// config/db.js
const mongoose = require("mongoose");
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        logger.info("Connected to MongoDB");
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
        
    } catch (err) {
        logger.error("MongoDB connection error:", err.message);
        console.error("Full error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
