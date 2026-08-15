import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { NotFoundError, UserAlreadyExistsError, UnauthorizedError, BadRequestError, ForbiddenError } from '../utils/errors/AppError.js'

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
    
    
    
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '3d'})
    
        return {user, token}
    
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
    
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '3d'})
    


        return { token, user }
    
}

export const signOutUser = () => {


}