import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.middleware.js'

const app = express()

app.use(express.json({
    limit: "1mb"
}))
app.use(helmet())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())


app.use('/api/auth', authRoutes)

app.use(errorHandler)


export default app