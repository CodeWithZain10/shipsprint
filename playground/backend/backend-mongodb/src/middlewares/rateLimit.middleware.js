import rateLimit from 'express-rate-limit'

const windowLimit = 15*60*1000

export const authRateLimit = rateLimit({
    windowMs: windowLimit,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too Many Requests"
    },
    statusCode: 429
})

