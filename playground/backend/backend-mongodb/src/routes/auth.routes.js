import express from "express";
import { signupUser, signinUser, signoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from '../middlewares/validate.middleware.js'
import { registerSchema, loginSchema } from '../utils/validation/auth.validation.js'


const router = express.Router();

router.post('/signup', validateMiddleware(registerSchema), signupUser);
router.post('/signin', validateMiddleware(loginSchema), signinUser);
router.post('/signout', authMiddleware, signoutUser);

export default router;