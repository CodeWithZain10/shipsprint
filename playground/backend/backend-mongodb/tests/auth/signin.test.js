import app from '../../src/app.js'
import supertest from 'supertest'
import {test, expect} from 'vitest'

const api = supertest(app)

test("signs in user successfully", async () => {
    await api.post('/api/auth/signup').send({
        username: "shipsprint.signin",
        email: "shipsprint.signin@gmail.com",
        password: "shipsprint123"
    })

    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@gmail.com",
        password: "shipsprint123"
    })
    
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("User logged in successfully")
    expect(response.body.user).toBeDefined()
})


test("rejects signin when email does not exist", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "doestnotexist@gmail.com",
        password: "shipsprint123"
    })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe("User not found")
})


test("rejects signin when password is incorrect", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@gmail.com",
        password: "shipsprint1293"
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe("Invalid username or password")
})


test("rejects signin when email is missing", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "",
        password: "shipsprint1293"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" is not allowed to be empty')
})



test("rejects signin when password is missing", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@gmail.com",
        password: ""
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" is not allowed to be empty')
})


test("rejects signin when email is invalid", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signingmail.com",
        password: "shipsprint123"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" must be a valid email')
})

test("rejects signin when email is missing", async () => {
    const response = await api.post('/api/auth/signin').send({
        password: "shipsprint123"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" is required')
})


test("rejects signin when password is missing", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@gmail.com"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" is required')
})


test("rejects signin when email contains only spaces", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "   ",
        password: "shipsprint123"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" must be a valid email')
})


test("rejects signin when password contains only spaces", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@gmail.com",
        password: "   "
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" length must be at least 6 characters long')
})


test("rejects signin when email has missing domain", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@",
        password: "shipsprint123"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" must be a valid email')
})


test("rejects signin when password is too short", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@gmail.com",
        password: "ship"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" length must be at least 6 characters long')
})


test("rejects signin when password is too long", async () => {
    const response = await api.post('/api/auth/signin').send({
        email: "shipsprint.signin@gmail.com",
        password: "ShipSprintPassword12345678901234567890"
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid username or password')
})