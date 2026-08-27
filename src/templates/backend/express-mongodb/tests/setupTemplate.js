const setupTemplate = () => {
    return `import dotenv from "dotenv"
import mongoose from "mongoose"
import { afterAll, beforeAll } from "vitest"

dotenv.config({ path: '.env.test' })

if(process.env.NODE_ENV !== 'test'){
    throw new Error("Test can only run with NODE_ENV=test")
}

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
})

afterAll(async () => {
    if(process.env.NODE_ENV == 'test'){
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    }else{
        throw new Error("You are trying to drop production DB")
    }
})`
}

export default setupTemplate;
