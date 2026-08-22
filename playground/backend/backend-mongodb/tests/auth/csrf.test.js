import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'

const api = supertest.agent(app)

test('issues csrf token successfully', async () => {

    const response = await api
        .get('/api/auth/csrf')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe(
        'CSRF token generated successfully'
    )

    const cookies = response.headers['set-cookie']

    expect(cookies).toBeDefined()
    expect(
        cookies.some(cookie => cookie.startsWith('csrfToken='))
    ).toBe(true)
})


test('rejects signout when csrf token is missing', async () => {

    const response = await api
        .post('/api/auth/signout')

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('CSRF token missing')
})


test('rejects signout when csrf token is invalid', async () => {

    await api
        .get('/api/auth/csrf')

    const response = await api
        .post('/api/auth/signout')
        .set('X-CSRF-Token', 'invalid-csrf-token')

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Invalid CSRF token')
})


test('rejects refresh when csrf token is missing', async () => {

    const response = await api
        .post('/api/auth/refresh')

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('CSRF token missing')
})


test('rejects refresh when csrf token is invalid', async () => {

    await api
        .get('/api/auth/csrf')

    const response = await api
        .post('/api/auth/refresh')
        .set('X-CSRF-Token', 'invalid-csrf-token')

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Invalid CSRF token')
})