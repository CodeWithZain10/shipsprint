const signupTestTemplate = () => {
    return `import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'

const api = supertest(app)

test('creates a new user successfully', async () => {
    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.signup',
            email: 'shipsprint.signup@gmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created successfully')
    expect(response.body.user).toBeDefined()
    expect(response.body.user.email).toBe('shipsprint.signup@gmail.com')
    expect(response.body.user.user).toBe('shipsprint.signup')
    expect(response.body.user.password).toBeUndefined()

    const cookies = response.headers['set-cookie']
    expect(cookies).toBeDefined()
    expect(cookies.some(cookie => cookie.startsWith('accessToken='))).toBe(true)
    expect(cookies.some(cookie => cookie.startsWith('refreshToken='))).toBe(true)
})

test('rejects signup when email already exists', async () => {
    await api.post('/api/auth/signup').send({
        username: 'shipsprint.duplicate1',
        email: 'shipsprint.duplicate@gmail.com',
        password: 'shipsprint123'
    })

    const response = await api.post('/api/auth/signup').send({
        username: 'shipsprint.duplicate2',
        email: 'shipsprint.duplicate@gmail.com',
        password: 'shipsprint123'
    })

    expect(response.status).toBe(422)
    expect(response.body.message).toBe('User already exists')
})

test('rejects signup when username already exists', async () => {
    await api.post('/api/auth/signup').send({
        username: 'shipsprint.sameusername',
        email: 'shipsprint.username1@gmail.com',
        password: 'shipsprint123'
    })

    const response = await api.post('/api/auth/signup').send({
        username: 'shipsprint.sameusername',
        email: 'shipsprint.username2@gmail.com',
        password: 'shipsprint123'
    })

    expect(response.status).toBe(422)
})

test('rejects signup when email is invalid', async () => {
    const response = await api.post('/api/auth/signup').send({
        username: 'shipsprint.invalidemail',
        email: 'shipsprintgmail.com',
        password: 'shipsprint123'
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" must be a valid email')
})

test('rejects signup when email is missing', async () => {
    const response = await api.post('/api/auth/signup').send({
        username: 'shipsprint.missingemail',
        password: 'shipsprint123'
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" is required')
})

test('rejects signup when username is missing', async () => {
    const response = await api.post('/api/auth/signup').send({
        email: 'shipsprint.missingusername@gmail.com',
        password: 'shipsprint123'
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"username" is required')
})

test('rejects signup when password is missing', async () => {
    const response = await api.post('/api/auth/signup').send({
        username: 'shipsprint.missingpassword',
        email: 'shipsprint.missingpassword@gmail.com'
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" is required')
})

test('rejects signup when password is too short', async () => {
    const response = await api.post('/api/auth/signup').send({
        username: 'shipsprint.shortpassword',
        email: 'shipsprint.shortpassword@gmail.com',
        password: 'ship'
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" length must be at least 6 characters long')
})

test('creates user when password has minimum allowed length', async () => {
    const response = await api.post('/api/auth/signup').send({
        username: 'shipsprint.minpassword',
        email: 'shipsprint.minpassword@gmail.com',
        password: 'ship12'
    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created successfully')
})

test('trims leading and trailing spaces from username', async () => {
    const response = await api.post('/api/auth/signup').send({
        username: ' shipsprint.trim ',
        email: 'shipsprint.trim@gmail.com',
        password: 'shipsprint123'
    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created successfully')
    expect(response.body.user.user).toBe('shipsprint.trim')
})`
}

export default signupTestTemplate;
