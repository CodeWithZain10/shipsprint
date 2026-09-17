const appCodeTemplate = (answers) => {
    // Auth throws AppError subclasses, so it always needs the JSON error handler
    const includeErrorHandler = answers.includeErrorHandler || answers.includeAuthentication

    return `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import healthRoutes from './routes/health.routes.js'
${answers.includeLogger ? "import requestLogger from './middlewares/requestLogger.middleware.js'" : ""}
${answers.includeAuthentication ? "import authRoutes from './routes/auth.routes.js'" : ""}
${answers.includeAuthentication && answers.includeRBAC ? "import adminRoutes from './routes/admin.routes.js'" : ""}
${includeErrorHandler ? "import { errorHandler } from './middlewares/errorHandler.middleware.js'" : ""}

const app = express()

${answers.includeDocker ? "if (process.env.TRUST_PROXY === 'true') app.set('trust proxy', 1)\n" : ""}
${answers.includeLogger ? "app.use(requestLogger)" : ""}
app.use(express.json({
    limit: "1mb"
}))
app.use(helmet())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(cookieParser())

app.use('/', healthRoutes)
${answers.includeAuthentication ? "app.use('/api/auth', authRoutes)" : ""}
${answers.includeAuthentication && answers.includeRBAC ? "app.use('/api/admin', adminRoutes)" : ""}

${includeErrorHandler ? "app.use(errorHandler)" : ""}

export default app`
}

export default appCodeTemplate;
