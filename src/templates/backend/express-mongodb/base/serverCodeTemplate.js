const serverCodeTemplate = (answers) => {
    return `import 'dotenv/config'
import app from './src/app.js'
import connectDB from './src/config/db.js'
${answers.includeAuthentication ? "import validateEnv from './src/utils/validation/env.validation.js'\n" : ""}
${answers.includeAuthentication ? "validateEnv(['MONGO_URI', 'ACCESS_TOKEN_SECRET', 'ACCESS_TOKEN_EXPIRES_IN', 'REFRESH_TOKEN_EXPIRES_IN'])\n\n" : ""}
connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`)
})

`
}

export default serverCodeTemplate;
