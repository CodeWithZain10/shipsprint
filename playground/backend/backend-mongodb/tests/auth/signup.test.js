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


test("rejects signup when username is missing", async () => {
   const response = await api.post('/api/auth/signup').send({
                        email: "shipsprint@gmail.com",
                        password: "shipsprint"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"username" is required') 
})



test("rejects signup when password is missing", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint@gmail.com"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" is required') 
})



test("rejects signup when password is too short", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@gmail.com",
                        password: "ship"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" length must be at least 6 characters long') 

})



test("rejects signup when password is too long", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test1",
                        email: "shipsprint.test1@gmail.com",
                        password: "shiporeworwer9384ty4398t3htoregnrdogirehj54t54otrehgr8et8t3yhtrweghregurehgeaughareuigheruoe5twe9r4whytigsigriyodshsdoigsdg0egbeaiwghlgrbeoiguwe09gtwut0wes0vsjg0erger08gsagoiwregg0eawrhgrew80ghgashg8er0gyeg80ashg"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" length must be less than or equal to 30 characters long')


})



test("rejects signup when username is too short", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@gmail.com",
                        password: "shi"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" length must be at least 6 characters long')


})



test("rejects signup when username is too long", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shiporeworwer9384ty4398t3htoregnrdogirehj54t54otrehgr8et8t3yhtrweghregurehgeaughareuigheruoe5twe9r4whytigsigriyodshsdoigsdg0egbeaiwghlgrbeoiguwe09gtwut0wes0vsjg0erger08gsagoiwregg0eawrhgrew80ghgashg8er0gyeg80ashg",
                        email: "shipsprint.test@gmail.com",
                        password: "ship1241"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"username" length must be less than or equal to 30 characters long')


})



test("rejects signup when username is empty", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "",
                        email: "shipsprint.test@gmail.com",
                        password: "ship1241"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"username" is not allowed to be empty')


})



test("rejects signup when email is empty", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "",
                        password: "ship1241"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" is not allowed to be empty')


})


test("rejects signup when password is empty", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@gmail.com",
                        password: ""
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" is not allowed to be empty')


})



test("rejects signup when email is missing @", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.testgmail.com",
                        password: "shipsprint"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" must be a valid email')


})



test("rejects signup when email has missing domain", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@",
                        password: "shipsprint"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"email" must be a valid email')


})



test("creates user when password has minimum allowed length", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.test",
                        email: "shipsprint.test@gmail.com",
                        password: "ship"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" length must be at least 6 characters long')


})



test("creates user when password has maximum allowed length", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.maxpassword",
                        email: "shipsprint.maxpassword@gmail.com",
                        password: "ShipSprintPassword1234567890!"
                    })
    
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created successfully')


})



test("rejects signup when password contains only spaces", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: "shipsprint.maxpassword",
                        email: "shipsprint@gmail.com",
                        password: " "
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"password" is not allowed to be empty')


})


test("rejects signup when username contains only spaces", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: " ",
                        email: "shipsprint@gmail.com",
                        password: "shipsprint"
                    })
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"username" is not allowed to be empty')


})


test("rejects or trims username with leading and trailing spaces", async () => {
   const response = await api.post('/api/auth/signup').send({
                        username: " shipsprint ",
                        email: "shipsprint@gmail.com",
                        password: "shipsprint"
                    })
    
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User created successfully')


})

