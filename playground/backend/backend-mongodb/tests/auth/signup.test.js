import app from '../../src/app.js'
import supertest from 'supertest'
import {test, expect} from 'vitest'

const api = supertest(app)


test('creates a new user successfully.', async () => {
   const response =  await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@gmail.com",
                        password: "shipsprint"
                    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe("User created successfully")
    expect(response.body.user).toBeDefined()
    expect(response.body.user.email).toBe("shipsprint.test@gmail.com")
    expect(response.body.user.user).toBe("shipsprint.test")
    expect(response.body.user.password).toBeUndefined()
})

test("rejects signup when email already exists", async () => {
   await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@gmail.com",
                        password: "shipsprint"
                    })
      
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@gmail.com",
                        password: "shipsprint"
                    })
    
    expect(response.status).toBe(422)
    expect(response.body.message).toBe("User already exists")

})

test("rejects signup when email is invalid", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprintgmail",
                        password: "shipsprint"
                    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" must be a valid email')
    
})

test("rejects signup when email is missing", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        password: "shipsprint"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" is required') 
})