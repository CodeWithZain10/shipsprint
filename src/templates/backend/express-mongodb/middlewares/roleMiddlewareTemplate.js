const roleMiddlewareTemplate = () => {
    return `import { ForbiddenError, UnauthorizedError } from '../utils/errors/AppError.js'

// Usage: router.get('/admin', authMiddleware, roleMiddleware('admin'), handler)
// Must run after authMiddleware, which loads the user (and its role) from the database.
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            throw new UnauthorizedError('No token provided')
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ForbiddenError('You do not have permission to perform this action')
        }

        next()
    }
}

export default roleMiddleware`
}

export default roleMiddlewareTemplate;
