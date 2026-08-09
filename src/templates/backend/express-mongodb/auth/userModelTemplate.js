const userModelTemplate = () => {
return `import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address"],
        unique: [true, "Email is already exists"]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    }

})

UserSchema.pre("save", async function (next){

    if(!this.isModified("password")){
        return
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;

    return;
})

UserSchema.methods.comparePassword = async function(password) {
    
    return bcrypt.compare(password, this.password)

}





const userModel = mongoose.model('user', UserSchema)

export default userModel`
}

export default userModelTemplate