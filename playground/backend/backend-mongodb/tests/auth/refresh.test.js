import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'
import refreshTokenModel from '../../src/models/refreshToken.model.js'

const api = supertest(app)

test('refreshes access token successfully', async () => {

    await api.post('/api/auth/signup').send({
        username: "shipsprint.refresh",
        email: "shipsprint.refresh@gmail.com",
        password: "shipsprint123"
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: "shipsprint.refresh@gmail.com",
        password: "shipsprint123"
    })

    const refreshCookie = signinResponse.headers['set-cookie']

    expect(refreshCookie).toBeDefined()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', refreshCookie)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    const accessTokenCookie = response.headers['set-cookie']?.find(cookie => cookie.startsWith('accessToken='))

    expect(accessTokenCookie).toBeDefined()
})


test('rejects refresh when refresh token is missing', async () => {

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', '')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Unauthorized')
})



test('rejects refresh when refresh token is invalid', async () => {

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', 'refreshToken=invalid-refresh-token')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Unauthorized')
})



test('rejects refresh when refresh token is expired', async () => {

    await api.post('/api/auth/signup').send({
        username: "shipsprint.expired",
        email: "shipsprint.expired@gmail.com",
        password: "shipsprint123"
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: "shipsprint.expired@gmail.com",
        password: "shipsprint123"
    })

    const refreshCookie = signinResponse.headers['set-cookie']

    expect(refreshCookie).toBeDefined()

    const refreshTokenCookie = refreshCookie
        .find(cookie => cookie.startsWith('refreshToken='))

    expect(refreshTokenCookie).toBeDefined()

    const refreshToken = refreshTokenCookie
        .split(';')[0]
        .split('=')[1]

    const crypto = await import('node:crypto')

    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex')

    const refreshTokenRecord = await refreshTokenModel.findOne({
        tokenHash
    })

    expect(refreshTokenRecord).toBeDefined()

    refreshTokenRecord.expiresAt = new Date(Date.now() - 1000)

    await refreshTokenRecord.save()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', refreshCookie)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
})


test('refresh token is revoked', async () => {

})