const appCodeTemplate = (answers) => {
    return `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
${answers.includeAuthentication ? "import authRoutes from './routes/auth.routes.js'" : ""}
${answers.includeErrorHandler ? "import { errorHandler } from './middlewares/errorHandler.middleware.js'" : ""}

const app = express()

app.use(express.json({
    limit: "1mb"
}))
app.use(helmet())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser())

${answers.includeAuthentication ? "app.use('/api/auth', authRoutes)" : ""}

${answers.includeErrorHandler ? "app.use(errorHandler)" : ""}

export default app`
}

export default appCodeTemplate;