import { faker } from "@faker-js/faker";
import userModel from '../../models/user.model.js'
import connectDB from '../../../../src/config/db.js'
import dotenv from 'dotenv'
dotenv.config()

const fakeUserSeed = async () => {
    try {
        await connectDB();
        await userModel.deleteMany({});

        for (let i = 0; i < 10; i++) {
            const user = await userModel.create({
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: "Test@1234", 
            });
            console.log(`Created user: ${user.username} with email: ${user.email}`);
        }

        process.exit(0);
        
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

fakeUserSeed();
