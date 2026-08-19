import express from "express";
import { signupUser, signinUser, signoutUser, refreshAccessTokenController, profile, getCsrfToken } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from '../middlewares/validate.middleware.js'
import { registerSchema, loginSchema } from '../utils/validation/auth.validation.js'
import { signinRateLimit, signupRateLimit, refreshTokenRateLimit } from "../middlewares/rateLimit.middleware.js";
import csrfMiddleware from "../middlewares/csrf.middleware.js";



const router = express.Router();

router.post('/signup', signupRateLimit, validateMiddleware(registerSchema), signupUser);
router.post('/signin', signinRateLimit, validateMiddleware(loginSchema), signinUser);
router.post('/refresh', refreshTokenRateLimit, csrfMiddleware, refreshAccessTokenController)
router.post('/signout', csrfMiddleware, signoutUser);
router.get('/profile', authMiddleware, profile)
router.get('/csrf', getCsrfToken)

export default router;