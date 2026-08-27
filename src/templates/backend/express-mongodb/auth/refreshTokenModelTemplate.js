const refreshTokenModelTemplate = () => {
    return `import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    revokedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const refreshTokenModel = mongoose.model("refreshToken", RefreshTokenSchema)

export default refreshTokenModel`
}

export default refreshTokenModelTemplate;
