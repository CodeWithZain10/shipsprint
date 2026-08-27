import { ValidationError } from '../utils/errors/AppError.js'

const validateMiddleware = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body)
        if (error) {
            throw new ValidationError(error.details[0].message)
        }
        req.body = value
        next()
    }
}

export default validateMiddleware