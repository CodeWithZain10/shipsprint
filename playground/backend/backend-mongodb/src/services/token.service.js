import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import refreshTokenModel from '../models/refreshToken.model.js'
import { parseDuration } from '../utils/duration.js'
import { UnauthorizedError, TokenNotActiveError, TokenExpiredError, InvalidTokenError, AppError } from '../utils/errors/AppError.js'
import userModel from '../models/user.model.js'
import { after } from 'node:test'

export const generateAccessToken = (userId) => {

    const token = jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN})

    return token;

}

export const generateRefreshToken = () => {

    const refreshToken = crypto.randomBytes(64).toString('base64url')

    return refreshToken


}

export const hashRefreshToken = (refreshToken) => {
    const hashToken = crypto.createHash("sha256").update(refreshToken).digest('hex')

    return hashToken

}

export const createRefreshTokenSession = async (userId) => {

    const rawRefreshToken = generateRefreshToken()

    const hashedToken = hashRefreshToken(rawRefreshToken)



    const duration = parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN)

    const expiresAt = new Date(Date.now() + duration)

    await refreshTokenModel.create({
        user: userId,
        tokenHash: hashedToken,
        expiresAt: expiresAt
    })

    return rawRefreshToken; 

}

export const validateRefreshToken = async (rawRefreshToken) => {
    const hashedRefreshToken = hashRefreshToken(rawRefreshToken)

    const session = await refreshTokenModel.findOne({
                tokenHash: hashedRefreshToken
            })
    
    if(session === null) throw new UnauthorizedError("Unauthorized")

    if(session.revokedAt !== null) { 
        await revokeAllUserRefreshSessions(session.user)
        throw new UnauthorizedError("token is revoked")
    }

    if(session.expiresAt <= new Date()) {
        throw new TokenExpiredError() 
    }


    return session;
  
}

export const refreshAccessToken = async (rawRefreshToken) => {

    const session = await validateRefreshToken(rawRefreshToken)
    const revokedSession = await revokeRefreshTokenAtomically(rawRefreshToken)

    if(!revokedSession) throw new UnauthorizedError("Refresh token already used")

    const refreshToken = await createRefreshTokenSession(session.user)
    const accessToken = generateAccessToken(session.user)

    return { refreshToken, accessToken }


}


export const revokeRefreshToken = async (rawRefreshToken) => {
    const handleRefreshToken = hashRefreshToken(rawRefreshToken)

    const session = await refreshTokenModel.findOne({ tokenHash: handleRefreshToken })

    if(!session) return;

    if(session.revokedAt !== null) return

    session.revokedAt = new Date()

    await session.save()

}

export const verifyAccessToken = async (accessToken) => {

    if(!accessToken) {
            throw new UnauthorizedError('No token provided')
        }
    
    try {
    
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await userModel.findById(decoded.id).select("-password")
    
        if(!user) {
                throw new UnauthorizedError('user not exists')
            }
        
        return user;

    } catch (error) {
        const err = error.name
        
        if(err === "TokenExpiredError") throw new TokenExpiredError()
        if(err === "JsonWebTokenError") throw new InvalidTokenError()
        if(err === "NotBeforeError") throw new TokenNotActiveError()
        if(error instanceof AppError) throw error

        throw new UnauthorizedError("Something is wrong")
    }

}

export const revokeAllUserRefreshSessions = async (userId) => {

    await refreshTokenModel.updateMany({ user: userId, revokedAt: null }, {$set: { revokedAt: new Date() }})

}

export const revokeRefreshTokenAtomically = async (refreshToken) => {

    const hashedToken = hashRefreshToken(refreshToken)

    const session = await refreshTokenModel.findOneAndUpdate({tokenHash: hashedToken, revokedAt: null}, {$set:{ revokedAt: new Date() }}, { returnDocument: after })

    return session

}