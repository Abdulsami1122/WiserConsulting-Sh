/**
 * Rate Limiting Middleware
 * Prevents abuse and DDoS attacks
 */

const rateLimit = require('express-rate-limit');

// Helper to skip rate limiting for local development or when NODE_ENV is development
const shouldSkip = (req) => {
  if (process.env.NODE_ENV === 'development') return true;
  const ip = req.ip || (req.connection && req.connection.remoteAddress);
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
};

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkip,
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter
};

