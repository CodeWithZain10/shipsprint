const serverCodeTemplate = (includeAuthentication) => {
    return `import dotenv from 'dotenv'
import app from './src/app.js' 
import connectDB from './src/config/db.js'
${includeAuthentication ? "import validateEnv from './src/utils/validation/env.validation.js'\n" : ""}
dotenv.config()

${includeAuthentication ? "validateEnv(['MONGO_URI', 'JWT_SECRET'])\n\n" : ""}
connectDB()


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

`
}

export default serverCodeTemplate;