import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import refreshTokenModel from '../models/refreshToken.model.js'

export const generateAccessToken = (userId) => {

    const token = jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN})

    return { token }

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

    const calculateTokenExpiry = Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRES_IN);

    await refreshTokenModel.create({
        user: userId,
        tokenHash: hashedToken,
        expiresAt: calculateTokenExpiry
    })

    return { rawRefreshToken }

}