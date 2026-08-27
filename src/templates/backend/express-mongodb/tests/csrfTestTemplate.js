const csrfTestTemplate = () => {
    return `import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'

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

test('generates csrf token successfully', async () => {
    const response = await api.get('/api/auth/csrf')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)

    const csrfCookie = response.headers['set-cookie']
        ?.find(cookie => cookie.startsWith('csrfToken='))

    expect(csrfCookie).toBeDefined()
})

test('allows request when valid csrf token and header are provided', async () => {
    const authCookies = await signupAndSignin('shipsprint.csrf.valid', 'shipsprint.csrf.valid@gmail.com')

    const csrfRes = await api.get('/api/auth/csrf')
    const csrfCookie = csrfRes.headers['set-cookie']?.find(c => c.startsWith('csrfToken='))
    const csrfToken = csrfCookie.split(';')[0].split('=')[1]

    const response = await api
        .post('/api/auth/signout')
        .set('Cookie', [...authCookies, csrfCookie])
        .set('X-CSRF-Token', csrfToken)

    expect(response.status).toBe(200)
})

test('rejects request when csrf cookie is missing', async () => {
    const authCookies = await signupAndSignin('shipsprint.csrf.nocookie', 'shipsprint.csrf.nocookie@gmail.com')

    const response = await api
        .post('/api/auth/signout')
        .set('Cookie', authCookies)
        .set('X-CSRF-Token', 'some-token')

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('CSRF token missing')
})

test('rejects request when csrf header is missing', async () => {
    const authCookies = await signupAndSignin('shipsprint.csrf.noheader', 'shipsprint.csrf.noheader@gmail.com')
    const csrfRes = await api.get('/api/auth/csrf')
    const csrfCookie = csrfRes.headers['set-cookie']?.find(c => c.startsWith('csrfToken='))

    const response = await api
        .post('/api/auth/signout')
        .set('Cookie', [...authCookies, csrfCookie])

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('CSRF token missing')
})

test('rejects request when csrf token and header mismatch', async () => {
    const authCookies = await signupAndSignin('shipsprint.csrf.mismatch', 'shipsprint.csrf.mismatch@gmail.com')
    const csrfRes = await api.get('/api/auth/csrf')
    const csrfCookie = csrfRes.headers['set-cookie']?.find(c => c.startsWith('csrfToken='))

    const response = await api
        .post('/api/auth/signout')
        .set('Cookie', [...authCookies, csrfCookie])
        .set('X-CSRF-Token', 'mismatched-token')

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Invalid CSRF token')
})`
}

export default csrfTestTemplate;
