const adminControllerTemplate = () => {
    return `import mongoose from 'mongoose'
import userModel, { ROLES } from '../models/user.model.js'
import { BadRequestError, NotFoundError } from '../utils/errors/AppError.js'

const toUserResponse = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
})

export const listUsers = async (req, res) => {
    const users = await userModel.find().sort({ _id: -1 })

    res.status(200).json({
        success: true,
        users: users.map(toUserResponse)
    })
}

export const updateUserRole = async (req, res) => {
    const { id } = req.params
    const { role } = req.body || {}

    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError('Invalid user id')
    }

    if (!ROLES.includes(role)) {
        throw new BadRequestError(\`Role must be one of: \${ROLES.join(', ')}\`)
    }

    if (req.user._id.equals(id)) {
        throw new BadRequestError('You cannot change your own role')
    }

    const user = await userModel.findByIdAndUpdate(id, { role }, { returnDocument: 'after', runValidators: true })

    if (!user) {
        throw new NotFoundError('User not found')
    }

    res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        user: toUserResponse(user)
    })
}`
}

export default adminControllerTemplate;
