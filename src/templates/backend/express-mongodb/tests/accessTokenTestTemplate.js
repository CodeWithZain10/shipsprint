const accessTokenTestTemplate = () => {
    return `import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import userModel from '../../src/models/user.model.js'

const api = supertest(app)

const createUserAndSignin = async () => {
    await api.post('/api/auth/signup').send({
        username: 'shipsprint.access',
        email: 'shipsprint.access@gmail.com',
        password: 'shipsprint123'
    })

    const signinResponse = await api.post('/api/auth/signin').send({
        email: 'shipsprint.access@gmail.com',
        password: 'shipsprint123'
    })

    const cookies = signinResponse.headers['set-cookie']
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith('accessToken='))

    expect(accessTokenCookie).toBeDefined()
    return { cookies, accessTokenCookie }
}

test('allows access to profile with valid access token', async () => {
    const { accessTokenCookie } = await createUserAndSignin()
    const response = await api.get('/api/auth/profile').set('Cookie', [accessTokenCookie])

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('working')
})

test('rejects profile when access token is missing', async () => {
    const response = await api.get('/api/auth/profile')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('No token provided')
})

test('rejects profile when access token is invalid', async () => {
    const response = await api.get('/api/auth/profile').set('Cookie', 'accessToken=invalid-access-token')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Invalid access token')
})

test('rejects profile when access token is malformed', async () => {
    const response = await api.get('/api/auth/profile').set('Cookie', 'accessToken=abc.def.ghi')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Invalid access token')
})

test('rejects profile when access token is expired', async () => {
    const signupResponse = await api.post('/api/auth/signup').send({
        username: 'shipsprint.expiredaccess',
        email: 'shipsprint.expiredaccess@gmail.com',
        password: 'shipsprint123'
    })

    expect(signupResponse.status).toBe(201)

    const user = await userModel.findOne({ email: 'shipsprint.expiredaccess@gmail.com' })
    expect(user).toBeDefined()

    const expiredToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: -1 }
    )

    const response = await api.get('/api/auth/profile').set('Cookie', \`accessToken=\${expiredToken}\`)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Access token expired')
})

test('rejects profile when access token was signed with wrong secret', async () => {
    const user = await userModel.create({
        username: 'shipsprint.wrongsecret',
        email: 'shipsprint.wrongsecret@gmail.com',
        password: 'shipsprint123'
    })

    const token = jwt.sign(
        { id: user._id },
        'wrong-secret',
        { expiresIn: '15m' }
    )

    const response = await api.get('/api/auth/profile').set('Cookie', \`accessToken=\${token}\`)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Invalid access token')
})

test('rejects profile when token user no longer exists', async () => {
    const fakeUserId = '507f1f77bcf86cd799439011'

    const token = jwt.sign(
        { id: fakeUserId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const response = await api.get('/api/auth/profile').set('Cookie', \`accessToken=\${token}\`)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('user not exists')
})

test('rejects profile when access token is not active yet', async () => {
    const user = await userModel.create({
        username: 'shipsprint.notactive',
        email: 'shipsprint.notactive@gmail.com',
        password: 'shipsprint123'
    })

    const token = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m', notBefore: '10m' }
    )

    const response = await api.get('/api/auth/profile').set('Cookie', \`accessToken=\${token}\`)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Token is not active yet')
})`
}

export default accessTokenTestTemplate;
