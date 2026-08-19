import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'
import refreshTokenModel from '../../src/models/refreshToken.model.js'
import crypto from 'node:crypto'

const api = supertest(app)


test('signs out user successfully', async () => {

    await api.post('/api/auth/signup').send({
        username: "shipsprint.signout",
        email: "shipsprint.signout@gmail.com",
        password: "shipsprint123"
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: "shipsprint.signout@gmail.com",
        password: "shipsprint123"
    })

    const authCookies = signinResponse.headers['set-cookie']

    expect(authCookies).toBeDefined()

    const signoutResponse = await api
        .post('/api/auth/signout')
        .set('Cookie', authCookies)

    expect(signoutResponse.status).toBe(200)
    expect(signoutResponse.body.message).toBe('User logged out successfully')

    const clearedCookies = signoutResponse.headers['set-cookie']

    expect(clearedCookies).toBeDefined()

    expect(
        clearedCookies.some(cookie => cookie.startsWith('accessToken='))
    ).toBe(true)

    expect(
        clearedCookies.some(cookie => cookie.startsWith('refreshToken='))
    ).toBe(true)
})


test('rejects signout when access token is missing', async () => {

    const response = await api
        .post('/api/auth/signout')
        .set('Cookie', '')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('No token provided')
})


test('rejects signout when access token is invalid', async () => {

    const response = await api
        .post('/api/auth/signout')
        .set('Cookie', 'accessToken=invalid-access-token')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
})


test('revokes refresh token when user signs out', async () => {

    await api.post('/api/auth/signup').send({
        username: "shipsprint.signout.revoke",
        email: "shipsprint.signout.revoke@gmail.com",
        password: "shipsprint123"
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: "shipsprint.signout.revoke@gmail.com",
        password: "shipsprint123"
    })

    const authCookies = signinResponse.headers['set-cookie']

    expect(authCookies).toBeDefined()

    const refreshTokenCookie = authCookies.find(cookie =>
        cookie.startsWith('refreshToken=')
    )

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
    expect(refreshTokenRecord.revokedAt).toBeNull()

    const signoutResponse = await api
        .post('/api/auth/signout')
        .set('Cookie', authCookies)

    expect(signoutResponse.status).toBe(200)

    const updatedRefreshToken = await refreshTokenModel.findOne({
        tokenHash
    })

    expect(updatedRefreshToken).toBeDefined()
    expect(updatedRefreshToken.revokedAt).toBeDefined()
})


test('rejects refresh token reuse after signout', async () => {

    await api.post('/api/auth/signup').send({
        username: "shipsprint.signout.reuse",
        email: "shipsprint.signout.reuse@gmail.com",
        password: "shipsprint123"
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: "shipsprint.signout.reuse@gmail.com",
        password: "shipsprint123"
    })

    const authCookies = signinResponse.headers['set-cookie']

    expect(authCookies).toBeDefined()

    const signoutResponse = await api
        .post('/api/auth/signout')
        .set('Cookie', authCookies)

    expect(signoutResponse.status).toBe(200)

    const refreshResponse = await api
        .post('/api/auth/refresh')
        .set('Cookie', authCookies)

    expect(refreshResponse.status).toBe(401)
    expect(refreshResponse.body.success).toBe(false)
    expect(refreshResponse.body.message).toBe('token is revoked')
})
