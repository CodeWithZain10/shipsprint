import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config.js'
import { signupUser as signupUserService, signinUser as signinUserService, signOutUser as signoutUserService } from '../services/auth.service.js'
import { refreshAccessToken, validateRefreshToken } from '../services/token.service.js'
import { generateCsrfToken } from '../utils/csrf.js'
import {UnauthorizedError} from '../utils/errors/AppError.js'

export const signupUser = async (req, res) => {

    const data = req.body

    const { user, accessToken, refreshToken } = await signupUserService(data)

    res.cookie("accessToken", accessToken, accessTokenCookieOptions )
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        
    res.status(201).json({
        message: "User created successfully",
            user: {
                _id: user._id,
                user: user.username,
                email: user.email
                }
            })

    

}

export const signinUser = async (req, res) => {

    const data = req.body

    const { user, accessToken, refreshToken } = await signinUserService(data)
        
    res.cookie("accessToken", accessToken, accessTokenCookieOptions)
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)

    res.status(200).json({
        message: "User logged in successfully",
            user: {
                _id: user._id,
                user: user.username,
                email: user.email
                }
                })

   
}


export const signoutUser = async (req, res) => {

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken) {
        throw new UnauthorizedError('No token provided')
    }

    await signoutUserService(refreshToken)

    res.clearCookie("accessToken", accessTokenCookieOptions)
    res.clearCookie("refreshToken", refreshTokenCookieOptions)

    res.status(200).json({message: "User logged out successfully"})
  
}


export const refreshAccessTokenController = async (req, res) => {
    const rawRefreshToken = req.cookies.refreshToken

    if(!rawRefreshToken){
        throw new UnauthorizedError("Unauthorized")
    } 

    const { accessToken, refreshToken } = await refreshAccessToken(rawRefreshToken)

    res.cookie("accessToken", accessToken, accessTokenCookieOptions)
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)

    return res.status(200).json({ success: true })
    
}

export const profile = (req, res) => {
    console.log(req.user)

    res.json({message: "working"})
}

export const getCsrfToken = (req, res) => {
    const csrfToken = generateCsrfToken()

    res.cookie('csrfToken', csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    })

    res.status(200).json({
        success: true,
        message: 'CSRF token generated successfully'
    })
}