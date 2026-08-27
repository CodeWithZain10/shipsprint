const getAuthMiddlewareContent = () => {
    return `import { verifyAccessToken } from '../services/token.service.js'

const authMiddleware = async (req, res, next) => {

    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1]
    const user = await verifyAccessToken(accessToken)
    
    req.user = user
   
    next()
}

export default authMiddleware`
}

export default getAuthMiddlewareContent;