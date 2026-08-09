const authControllerTemplate = (includeErrorHandler) => {
return `import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
${includeErrorHandler ? "import { NotFoundError, UserAlreadyExistsError, UnauthorizedError, BadRequestError, ForbiddenError } from '../utils/errors/AppError.js'" : ""}


export const registerUser = async (req, res) => {

    const {username, email, password} = req.body


    const isUserAlreadyExists = await userModel.findOne({email})

    if(isUserAlreadyExists) {
        ${includeErrorHandler ? 'throw new UserAlreadyExistsError(\'User already exists\')' : 'res.status(400).json({message: "User already exists"})'}
    }

    const user = await userModel.create({
        username, 
        email, 
        password
    })



    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '3d'})

    res.cookie("token", token)


     res.status(201).json({
        message: "User created successfully",
        user: {
            _id: user._id,
            user: user.username,
            email: user.email,
            password: user.password, 
        },
        token: token
    })



}

export const loginUser = async (req, res) => {

    const {email, password} = req.body


    const user = await userModel.findOne({email}).select("+password")

    if(!user) {
        ${includeErrorHandler ? 'throw new NotFoundError(\'User not found\')' : 'res.status(404).json({message: "User not found"})'}
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect) {
        ${includeErrorHandler ? 'throw new UnauthorizedError(\'Invalid username or password\')' : 'res.status(401).json({message: "Invalid username or password"})'}
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '3d'})

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            user: user.username,
            email: user.email,
            password: user.password, 
            },
            token: token
        })

}


export const logoutUser = async (req, res) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        ${includeErrorHandler ? 'throw new UnauthorizedError(\'No token provided\')' : 'res.status(401).json({message: "No token provided"})'}
    }

    res.clearCookie("token")

    res.status(200).json({message: "User logged out successfully"})

}`
}

export default authControllerTemplate;