const appCodeTemplate = (includeAuthentication, includeValidation) => {
    return `import express from 'express'
import cors from 'cors'
 ${includeAuthentication ? "import authRoutes from './routes/auth.routes.js'" : "" }
 ${includeValidation ? "import { errorHandler } from './middlewares/errorHandler.middleware.js'" : "" }
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())


${includeAuthentication ? "app.use('/api/auth', authRoutes)" : "" }


${includeValidation ? "app.use(errorHandler)" : "" }


export default app`
}

export default appCodeTemplate;