// config/db.js
const mongoose = require("mongoose");
const dns = require('dns');
const logger = require('../utils/logger');

const connectDB = async () => {
    let mongoURI = process.env.MONGODB_URI;
    const localURI = "mongodb://127.0.0.1:27017/wiserconsulting";

    if (!mongoURI) {
        logger.warn("MONGODB_URI environment variable is not defined. Using local fallback.");
        mongoURI = localURI;
    }

    try {
        // Fix local Node SRV resolution issues for mongodb+srv URIs
        if (mongoURI.startsWith('mongodb+srv')) {
            try {
                dns.setServers(['8.8.8.8', '8.8.4.4']);
            } catch (dnsErr) {
                logger.warn("Failed to set custom DNS servers, using system default DNS:", dnsErr.message);
            }
        }

        logger.info(`Attempting to connect to MongoDB...`);
        
        // Try connecting to the primary URI with a shorter timeout for fast fallback
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        });

        logger.info(`Connected to MongoDB at ${mongoURI}`);

        mongoose.connection.on('connected', () => {
            logger.info(`MongoDB connected to ${mongoose.connection.host}:${mongoose.connection.port}`);
        });

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
        // If the primary connection failed and it wasn't already localURI, try the local fallback
        if (mongoURI !== localURI) {
            logger.warn(`⚠️ Failed to connect to primary MongoDB Atlas database (${mongoURI.replace(/:([^@]+)@/, ':****@')}).`);
            logger.warn(`Reason: ${err.message}`);
            logger.warn(`🔄 Falling back to local MongoDB instance...`);
            try {
                await mongoose.connect(localURI, {
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                });
                logger.info(`✅ Successfully connected to local MongoDB fallback at ${localURI}`);
                return;
            } catch (localErr) {
                logger.error("❌ Failed to connect to local MongoDB fallback:", localErr.message);
            }
        }
        
        logger.error("MongoDB connection error:", err.message);
        console.error("Full error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
