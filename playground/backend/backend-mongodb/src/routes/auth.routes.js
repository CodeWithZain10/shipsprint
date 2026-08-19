import express from "express";
import { signupUser, signinUser, signoutUser, refreshAccessTokenController, profile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from '../middlewares/validate.middleware.js'
import { registerSchema, loginSchema } from '../utils/validation/auth.validation.js'
import { authRateLimit } from "../middlewares/rateLimit.middleware.js";


const router = express.Router();

router.post('/signup', validateMiddleware(registerSchema), signupUser);
router.post('/signin', authRateLimit, validateMiddleware(loginSchema), signinUser);
router.post('/refresh', refreshAccessTokenController)
router.post('/signout', signoutUser);
router.get('/profile', authMiddleware, profile)

export default router;