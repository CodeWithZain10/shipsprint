import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'

const api = supertest(app)

test('returns profile when authenticated with valid token', async () => {
    const signupRes = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.profiletest',
            email: 'shipsprint.profiletest@gmail.com',
            password: 'shipsprint123'
        })

    const cookies = signupRes.headers['set-cookie']
    const accessTokenCookie = cookies?.find(c => c.startsWith('accessToken='))

    expect(accessTokenCookie).toBeDefined()

    const response = await api
        .get('/api/auth/profile')
        .set('Cookie', [accessTokenCookie])

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('working')
})

test('rejects profile request when token is missing', async () => {
    const response = await api.get('/api/auth/profile')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('No token provided')
})
