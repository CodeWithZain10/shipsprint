import { signupUser as signupUserService, signinUser as signinUserService} from '../services/auth.service.js'

export const signupUser = async (req, res) => {

    const data = req.body

    const { user, token } = await signupUserService(data)

    res.cookie("token", token)
        
        
    res.status(201).json({
        message: "User created successfully",
            user: {
                _id: user._id,
                user: user.username,
                email: user.email
                },
                token: token
            })

}

export const signinUser = async (req, res) => {

    const data = req.body

    const { user, token } = await signinUserService(data)
        
    res.cookie("token", token)
        
    res.status(200).json({
        message: "User logged in successfully",
            user: {
                _id: user._id,
                user: user.username,
                email: user.email
                },
                token: token
                })

   
}


export const signoutUser = async (req, res) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        throw new UnauthorizedError('No token provided')
    }

    res.clearCookie("token")

    res.status(200).json({message: "User logged out successfully"})
  
}