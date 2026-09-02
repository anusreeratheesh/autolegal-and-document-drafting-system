const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' 
        ? 10000  // Essentially unlimited for development (10k requests per 15 min)
        : (parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100),
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => {
        // Skip rate limiting in development
        return process.env.NODE_ENV === 'development';
    }
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per windowMs (increased for development)
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.'
    }
});

// Rate limit for document generation (expensive operation)
const generationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 generations per hour
    message: {
        success: false,
        error: 'Generation limit reached. Please try again later.'
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    generationLimiter
};
