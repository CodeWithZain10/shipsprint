const makeAdminTemplate = () => {
    return `import 'dotenv/config'
import mongoose from 'mongoose'
import userModel from '../../models/user.model.js'
import connectDB from '../../config/db.js'

// Usage: npm run make-admin -- user@example.com
const email = process.argv[2]

if (!email) {
    console.error('Usage: npm run make-admin -- <email>')
    process.exit(1)
}

await connectDB()

const user = await userModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: 'admin' },
    { returnDocument: 'after' }
)

if (!user) {
    console.error(\`No user found with email \${email}\`)
    await mongoose.disconnect()
    process.exit(1)
}

console.log(\`\${user.email} is now an admin\`)
await mongoose.disconnect()`
}

export default makeAdminTemplate;
