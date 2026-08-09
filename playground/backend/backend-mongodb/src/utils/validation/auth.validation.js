import joi from 'joi'

const registerSchema = joi.object({
    email: joi.string().email().required(),
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(6).required()
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})

export { registerSchema, loginSchema }