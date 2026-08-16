import userModel from '../models/user.model.js'
import {generateAccessToken, createRefreshTokenSession, validateRefreshToken, revokeRefreshToken} from './token.service.js'
import { NotFoundError, UserAlreadyExistsError } from '../utils/errors/AppError.js'

export const signupUser = async (data) => {

    const {username, email, password} = data;

        const isUserAlreadyExists = await userModel.findOne({email})
    
        if(isUserAlreadyExists) {
            throw new UserAlreadyExistsError('User already exists')
        }
    
        const user = await userModel.create({
            username, 
            email, 
            password
        })
    
    
   const accessToken = generateAccessToken(user._id)
   const rawRefreshToken  = await createRefreshTokenSession(user._id)

    
    return {user, accessToken, refreshToken: rawRefreshToken}
    
}

export const signinUser = async (data) => {
     const {email, password} = data
    
    
        const user = await userModel.findOne({ email }).select("+password")
    
        if(!user) {
            throw new NotFoundError('User not found')
        }
    
        const isPasswordCorrect = await user.comparePassword(password)
    
        if(!isPasswordCorrect) {
            throw new UnauthorizedError('Invalid username or password')
        }
    
        const accessToken = generateAccessToken(user._id)
        const rawRefreshToken  = await createRefreshTokenSession(user._id)
    


        return { user, accessToken, refreshToken: rawRefreshToken }
    
}

export const signOutUser = async (refreshToken) => {

    await revokeRefreshToken(refreshToken)

}