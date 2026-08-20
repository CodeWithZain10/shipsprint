const appCodeTemplate = (answers) => {
    return `import express from 'express'
import cors from 'cors'
${answers.includeAuthentication ? "import authRoutes from './routes/auth.routes.js'" : "" }
${answers.includeValidation ? "import { errorHandler } from './middlewares/errorHandler.middleware.js'" : "" }
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())


${answers.includeAuthentication ? "app.use('/api/auth', authRoutes)" : "" }


${answers.includeValidation ? "app.use(errorHandler)" : "" }


export default app`
}

export default appCodeTemplate;