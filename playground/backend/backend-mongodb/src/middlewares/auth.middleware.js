import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../utils/errors/AppError.js'

const authMiddleware = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        throw new UnauthorizedError('No token provided')
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if(!user) {
            throw new UnauthorizedError('Invalid token')
        }

        req.user = user

        next()
        
    } catch (error) {
        throw new UnauthorizedError('Invalid token')
    }

}

export default authMiddleware