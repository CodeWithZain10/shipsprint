import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'
import refreshTokenModel from '../../src/models/refreshToken.model.js'
import crypto from 'node:crypto'

const api = supertest(app)

const signupAndSignin = async (username, email) => {

    await api.post('/api/auth/signup').send({
        username,
        email,
        password: 'shipsprint123'
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email,
        password: 'shipsprint123'
    })

    expect(signinResponse.status).toBe(200)

    return signinResponse.headers['set-cookie']
}


const getCsrfToken = async () => {

    const response = await api
        .get('/api/auth/csrf')

    expect(response.status).toBe(200)

    const csrfCookie = response.headers['set-cookie']
        ?.find(cookie => cookie.startsWith('csrfToken='))

    expect(csrfCookie).toBeDefined()

    const csrfToken = csrfCookie
        .split(';')[0]
        .split('=')[1]

    return {
        csrfCookie,
        csrfToken
    }
}


test('refreshes access token successfully', async () => {

    const refreshCookie = await signupAndSignin(
        'shipsprint.refresh',
        'shipsprint.refresh@gmail.com'
    )

    const {
        csrfCookie,
        csrfToken
    } = await getCsrfToken()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', [...refreshCookie, csrfCookie])
        .set('X-CSRF-Token', csrfToken)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)

    const accessTokenCookie = response.headers['set-cookie']
        ?.find(cookie => cookie.startsWith('accessToken='))

    expect(accessTokenCookie).toBeDefined()
})


test('rejects refresh when refresh token is missing', async () => {

    const {
        csrfCookie,
        csrfToken
    } = await getCsrfToken()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', csrfCookie)
        .set('X-CSRF-Token', csrfToken)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Unauthorized')
})


test('rejects refresh when refresh token is invalid', async () => {

    const {
        csrfCookie,
        csrfToken
    } = await getCsrfToken()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', [
            'refreshToken=invalid-refresh-token',
            csrfCookie
        ])
        .set('X-CSRF-Token', csrfToken)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Unauthorized')
})


test('rejects refresh when refresh token is expired', async () => {

    const refreshCookie = await signupAndSignin(
        'shipsprint.expired',
        'shipsprint.expired@gmail.com'
    )

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

    const {
        csrfCookie,
        csrfToken
    } = await getCsrfToken()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', [...refreshCookie, csrfCookie])
        .set('X-CSRF-Token', csrfToken)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Access token expired')
})


test('rejects refresh when refresh token is revoked', async () => {

    const refreshCookie = await signupAndSignin(
        'shipsprint.revoked',
        'shipsprint.revoked@gmail.com'
    )

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

    const {
        csrfCookie,
        csrfToken
    } = await getCsrfToken()

    const response = await api
        .post('/api/auth/refresh')
        .set('Cookie', [...refreshCookie, csrfCookie])
        .set('X-CSRF-Token', csrfToken)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('token is revoked')
})


test('rejects refresh when old refresh token is reused', async () => {

    const originalRefreshCookie = await signupAndSignin(
        'shipsprint.reuse',
        'shipsprint.reuse@gmail.com'
    )

    const {
        csrfCookie,
        csrfToken
    } = await getCsrfToken()

    const firstRefreshResponse = await api
        .post('/api/auth/refresh')
        .set('Cookie', [...originalRefreshCookie, csrfCookie])
        .set('X-CSRF-Token', csrfToken)

    expect(firstRefreshResponse.status).toBe(200)
    expect(firstRefreshResponse.body.success).toBe(true)

    const secondRefreshResponse = await api
        .post('/api/auth/refresh')
        .set('Cookie', [...originalRefreshCookie, csrfCookie])
        .set('X-CSRF-Token', csrfToken)

    expect(secondRefreshResponse.status).toBe(401)
    expect(secondRefreshResponse.body.success).toBe(false)
    expect(secondRefreshResponse.body.message).toBe('token is revoked')
})