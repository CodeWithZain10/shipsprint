import dotenv from 'dotenv'
import  validateEnv  from './playground/backend/backend-mongodb/src/utils/validation/env.validation.js'
import app from './src/app.js' 
import connectDB from './src/config/db.js'

dotenv.config()

validateEnv(['MONGO_URI', 'JWT_SECRET'])


connectDB()




app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

