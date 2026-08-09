
const getAuthMiddlewareContent = () => {
    return `import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if(!user) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.user = user

        next()
        
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }

}

export default authMiddleware`
}

export default getAuthMiddlewareContent;