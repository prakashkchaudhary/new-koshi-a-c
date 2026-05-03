const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    success: false, 
    message: 'Too many login attempts. Please try again in 15 minutes.' 
  }
});

// Booking rate limiter
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 bookings per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    success: false, 
    message: 'Too many booking attempts. Please wait a moment.' 
  }
});

// API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    success: false, 
    message: 'Too many requests. Please try again later.' 
  }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS from string inputs
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (paramName) => (req, res, next) => {
  const mongoose = require('mongoose');
  const id = req.params[paramName];
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format' 
    });
  }
  
  next();
};

// Prevent parameter pollution
const preventParameterPollution = (req, res, next) => {
  // Ensure query parameters are not arrays (except allowed ones)
  const allowedArrayParams = ['seats', 'amenities'];
  
  Object.keys(req.query).forEach(key => {
    if (Array.isArray(req.query[key]) && !allowedArrayParams.includes(key)) {
      req.query[key] = req.query[key][0]; // Take first value only
    }
  });
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  next();
};

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({ 
      success: false, 
      message: 'Request entity too large' 
    });
  }
  
  next();
};

module.exports = {
  authLimiter,
  bookingLimiter,
  apiLimiter,
  sanitizeInput,
  validateObjectId,
  preventParameterPollution,
  securityHeaders,
  requestSizeLimiter
};
