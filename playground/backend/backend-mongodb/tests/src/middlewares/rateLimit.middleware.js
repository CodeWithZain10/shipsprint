import rateLimit from 'express-rate-limit'

const windowLimit = 15 * 60 * 1000

const rateLimitOptions = {
    windowMs: windowLimit,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too Many Requests"
    },
    statusCode: 429
}

const signinLimiter = rateLimit(rateLimitOptions)
const signupLimiter = rateLimit(rateLimitOptions)
const refreshRateLimiter = rateLimit(rateLimitOptions)

const createTestAwareLimiter = (limiter) => {
    return (req, res, next) => {

        if (
            process.env.NODE_ENV === 'test' &&
            process.env.ENABLE_RATE_LIMIT !== 'true'
        ) {
            return next()
        }

        return limiter(req, res, next)
    }
}

export const signinRateLimit = createTestAwareLimiter(signinLimiter)
export const signupRateLimit = createTestAwareLimiter(signupLimiter)
export const refreshTokenRateLimit = createTestAwareLimiter(refreshRateLimiter)