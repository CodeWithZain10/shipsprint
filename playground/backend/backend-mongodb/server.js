import dotenv from 'dotenv/config'
import  validateEnv  from './src/utils/validation/env.validation.js'
import app from './src/app.js' 
import connectDB from './src/config/db.js'


validateEnv(['MONGO_URI', 'ACCESS_TOKEN_EXPIRES_IN', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_EXPIRES_IN'])


connectDB()




app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

