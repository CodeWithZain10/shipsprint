import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'
import refreshTokenModel from '../../src/models/refreshToken.model.js'
import crypto from 'node:crypto'

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

    const accessTokenCookie = response.headers['set-cookie']
        ?.find(cookie => cookie.startsWith('accessToken='))

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
    expect(response.body.message).toBe('Access token expired')
})


test('rejects refresh when refresh token is revoked', async () => {

    await api.post('/api/auth/signup').send({
        username: "shipsprint.revoked",
        email: "shipsprint.revoked@gmail.com",
        password: "shipsprint123"
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: "shipsprint.revoked@gmail.com",
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

    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex')

    const refreshTokenRecord = await refreshTokenModel.findOne({
        tokenHash
    })

    expect(refreshTokenRecord).toBeDefined()

    refreshTokenRecord.revokedAt = new Date()

    await refreshTokenRecord.save()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', refreshCookie)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('token is revoked')
})


test('rejects refresh when old refresh token is reused', async () => {

    await api.post('/api/auth/signup').send({
        username: "shipsprint.reuse",
        email: "shipsprint.reuse@gmail.com",
        password: "shipsprint123"
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: "shipsprint.reuse@gmail.com",
        password: "shipsprint123"
    })

    const originalRefreshCookie = signinResponse.headers['set-cookie']

    expect(originalRefreshCookie).toBeDefined()

    const firstRefreshResponse = await api
        .post('/api/auth/refresh')
        .set('Cookie', originalRefreshCookie)

    expect(firstRefreshResponse.status).toBe(200)
    expect(firstRefreshResponse.body.success).toBe(true)

    const secondRefreshResponse = await api
        .post('/api/auth/refresh')
        .set('Cookie', originalRefreshCookie)

    expect(secondRefreshResponse.status).toBe(401)
    expect(secondRefreshResponse.body.success).toBe(false)
    expect(secondRefreshResponse.body.message).toBe('token is revoked')
})
