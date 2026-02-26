import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: {
        success: false,
        message:
            "Too many requests from this IP, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message:
            "Too many requests from this IP, please try again after 1 hour",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const syncLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message:
            "Too many requests from this IP, please try again after 1 hour",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
