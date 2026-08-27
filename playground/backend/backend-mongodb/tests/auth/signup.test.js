import app from '../../src/app.js'
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
    expect(response.body.user.email)
        .toBe('shipsprint.signup@gmail.com')
    expect(response.body.user.user)
        .toBe('shipsprint.signup')

    expect(response.body.user.password)
        .toBeUndefined()

    const cookies = response.headers['set-cookie']

    expect(cookies).toBeDefined()

    expect(
        cookies.some(cookie => cookie.startsWith('accessToken='))
    ).toBe(true)

    expect(
        cookies.some(cookie => cookie.startsWith('refreshToken='))
    ).toBe(true)
})


test('rejects signup when email already exists', async () => {

    await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.duplicate1',
            email: 'shipsprint.duplicate@gmail.com',
            password: 'shipsprint123'
        })

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.duplicate2',
            email: 'shipsprint.duplicate@gmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(422)
    expect(response.body.message).toBe('User already exists')
})


test('rejects signup when username already exists', async () => {

    await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.sameusername',
            email: 'shipsprint.username1@gmail.com',
            password: 'shipsprint123'
        })

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.sameusername',
            email: 'shipsprint.username2@gmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(422)
})


test('rejects signup when email is invalid', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.invalidemail',
            email: 'shipsprintgmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"email" must be a valid email')
})


test('rejects signup when email is missing', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.missingemail',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"email" is required')
})


test('rejects signup when username is missing', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            email: 'shipsprint.missingusername@gmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"username" is required')
})


test('rejects signup when password is missing', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.missingpassword',
            email: 'shipsprint.missingpassword@gmail.com'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"password" is required')
})


test('rejects signup when password is too short', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.shortpassword',
            email: 'shipsprint.shortpassword@gmail.com',
            password: 'ship'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"password" length must be at least 6 characters long')
})


test('creates user when password has minimum allowed length', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.minpassword',
            email: 'shipsprint.minpassword@gmail.com',
            password: 'ship12'
        })

    expect(response.status).toBe(201)
    expect(response.body.message)
        .toBe('User created successfully')
})


test('rejects signup when password is too long', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.longpassword',
            email: 'shipsprint.longpassword@gmail.com',
            password:
                'shiporeworwer9384ty4398t3htoregnrdogirehj54t54otrehgr8et8t3yhtrweghregurehgeaughareuigheruoe5twe9r4whytigsigriyodshsdoigsdg0egbeaiwghlgrbeoiguwe09gtwut0wes0vsjg0erger08gsagoiwregg0eawrhgrew80ghgashg8er0gyeg80ashg'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"password" length must be less than or equal to 30 characters long')
})


test('creates user when password has maximum allowed length', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.maxpassword',
            email: 'shipsprint.maxpassword@gmail.com',
            password: 'ShipSprintPassword1234567890'
        })

    expect(response.status).toBe(201)
    expect(response.body.message)
        .toBe('User created successfully')
})


test('rejects signup when username is too long', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username:
                'shiporeworwer9384ty4398t3htoregnrdogirehj54t54otrehgr8et8t3yhtrweghregurehgeaughareuigheruoe5twe9r4whytigsigriyodshsdoigsdg0egbeaiwghlgrbeoiguwe09gtwut0wes0vsjg0erger08gsagoiwregg0eawrhgrew80ghgashg8er0gyeg80ashg',
            email: 'shipsprint.longusername@gmail.com',
            password: 'ship1241'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"username" length must be less than or equal to 30 characters long')
})


test('rejects signup when username is empty', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: '',
            email: 'shipsprint.emptyusername@gmail.com',
            password: 'ship1241'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"username" is not allowed to be empty')
})


test('rejects signup when email is empty', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.emptyemail',
            email: '',
            password: 'ship1241'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"email" is not allowed to be empty')
})


test('rejects signup when password is empty', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.emptypassword',
            email: 'shipsprint.emptypassword@gmail.com',
            password: ''
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"password" is not allowed to be empty')
})


test('rejects signup when email is missing @', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.noat',
            email: 'shipsprint.testgmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"email" must be a valid email')
})


test('rejects signup when email has missing domain', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.nodomain',
            email: 'shipsprint.test@',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"email" must be a valid email')
})


test('rejects signup when password contains only spaces', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: 'shipsprint.passwordspaces',
            email: 'shipsprint.passwordspaces@gmail.com',
            password: ' '
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"password" is not allowed to be empty')
})


test('rejects signup when username contains only spaces', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: ' ',
            email: 'shipsprint.usernamespaces@gmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(400)
    expect(response.body.message)
        .toBe('"username" is not allowed to be empty')
})


test('trims leading and trailing spaces from username', async () => {

    const response = await api
        .post('/api/auth/signup')
        .send({
            username: ' shipsprint.trim ',
            email: 'shipsprint.trim@gmail.com',
            password: 'shipsprint123'
        })

    expect(response.status).toBe(201)
    expect(response.body.message)
        .toBe('User created successfully')

    expect(response.body.user.user)
        .toBe('shipsprint.trim')
})
