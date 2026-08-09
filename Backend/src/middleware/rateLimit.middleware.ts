import rateLimit from "express-rate-limit";

// ======================================
// General API limiter
// 100 requests / 15 minutes
// ======================================
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

// ======================================
// Authentication limiter
// 10 requests / 15 minutes
// ======================================
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  }
});
// ======================================
// Chatbot limiter
// 20 requests / hour
// ======================================
export const chatbotLimiter = rateLimit({
    windowMs: 5 * 60 * 60 * 1000, // 5 hours
    max: 3,

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Chatbot rate limit exceeded. Please try again in 5 hours."
        });
    }
});