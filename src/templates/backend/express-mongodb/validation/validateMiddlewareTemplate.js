const validateMiddlewareTemplate = () => {
return `import { ValidationError } from '../utils/errors/AppError.js'

const validateMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body)
        if (error) {
            throw new ValidationError(error.details[0].message)
        }
        next()
    }
}

export default validateMiddleware`
}

export default validateMiddlewareTemplate;