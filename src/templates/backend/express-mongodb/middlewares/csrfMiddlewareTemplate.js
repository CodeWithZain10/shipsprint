const csrfMiddlewareTemplate = () => {
    return `import { ForbiddenError } from '../utils/errors/AppError.js'

const csrfMiddleware = (req, res, next) => {

    const csrfCookie = req.cookies.csrfToken
    const csrfHeader = req.get('X-CSRF-Token')

    if (!csrfCookie || !csrfHeader) {
        throw new ForbiddenError('CSRF token missing')
    }

    if (csrfCookie !== csrfHeader) {
        throw new ForbiddenError('Invalid CSRF token')
    }

    next()
}

export default csrfMiddleware`
}

export default csrfMiddlewareTemplate;
