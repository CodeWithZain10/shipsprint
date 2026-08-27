const rateLimitTestTemplate = () => {
    return `import express from 'express'
import supertest from 'supertest'
import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

import {
    signupRateLimit,
    refreshTokenRateLimit
} from '../../src/middlewares/rateLimit.middleware.js'

const app = express()
app.use(express.json())

app.post('/test-signup', signupRateLimit, (req, res) => {
    res.status(200).json({ success: true, message: 'Request allowed' })
})

app.post('/test-refresh', refreshTokenRateLimit, (req, res) => {
    res.status(200).json({ success: true, message: 'Request allowed' })
})

const api = supertest(app)

describe('Rate limiting', () => {
    beforeAll(() => {
        process.env.ENABLE_RATE_LIMIT = 'true'
    })

    afterAll(() => {
        process.env.ENABLE_RATE_LIMIT = 'false'
    })

    test('rejects signup when rate limit is exceeded', async () => {
        for (let i = 0; i < 10; i++) {
            const response = await api.post('/test-signup')
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
        }

        const response = await api.post('/test-signup')
        expect(response.status).toBe(429)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Too Many Requests')
    })

    test('rejects refresh when rate limit is exceeded', async () => {
        for (let i = 0; i < 10; i++) {
            const response = await api.post('/test-refresh')
            expect(response.status).toBe(200)
            expect(response.body.success).toBe(true)
        }

        const response = await api.post('/test-refresh')
        expect(response.status).toBe(429)
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Too Many Requests')
    })
})`
}

export default rateLimitTestTemplate;
