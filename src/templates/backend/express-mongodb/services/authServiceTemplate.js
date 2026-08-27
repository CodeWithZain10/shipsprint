const authServiceTemplate = () => {
    return `import userModel from '../models/user.model.js'
import {
    generateAccessToken,
    createRefreshTokenSession,
    revokeRefreshToken
} from './token.service.js'

import {
    NotFoundError,
    UnauthorizedError,
    UserAlreadyExistsError
} from '../utils/errors/AppError.js'


export const signupUser = async (data) => {

    const { username, email, password } = data

    const existingUser = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (existingUser) {

        if (existingUser.email === email) {
            throw new UserAlreadyExistsError('User already exists')
        }

        if (existingUser.username === username) {
            throw new UserAlreadyExistsError('Username already exists')
        }
    }

    try {

        const user = await userModel.create({
            username,
            email,
            password
        })

        const accessToken = generateAccessToken(user._id)

        const rawRefreshToken =
            await createRefreshTokenSession(user._id)

        return {
            user,
            accessToken,
            refreshToken: rawRefreshToken
        }

    } catch (error) {

        if (error.code === 11000) {
            throw new UserAlreadyExistsError('User already exists')
        }

        throw error
    }
}


export const signinUser = async (data) => {

    const { email, password } = data

    const user = await userModel
        .findOne({ email })
        .select('+password')

    if (!user) {
        throw new NotFoundError('User not found')
    }

    const isPasswordCorrect =
        await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new UnauthorizedError(
            'Invalid username or password'
        )
    }

    const accessToken =
        generateAccessToken(user._id)

    const rawRefreshToken =
        await createRefreshTokenSession(user._id)

    return {
        user,
        accessToken,
        refreshToken: rawRefreshToken
    }
}


export const signOutUser = async (refreshToken) => {

    await revokeRefreshToken(refreshToken)

}`
}

export default authServiceTemplate;
