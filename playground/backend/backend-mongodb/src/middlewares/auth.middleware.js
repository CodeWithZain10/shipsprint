import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../utils/errors/AppError.js'

const authMiddleware = async (req, res, next) => {

    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1]

    if(!accessToken) {
        throw new UnauthorizedError('No token provided')
    }

    try {

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await userModel.findById(decoded.id).select("-password")

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