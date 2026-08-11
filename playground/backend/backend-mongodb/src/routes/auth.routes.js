import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from '../middlewares/validate.middleware.js'
import { registerSchema, loginSchema } from '../utils/validation/auth.validation.js'


const router = express.Router();

router.post('/register', validateMiddleware(registerSchema), registerUser);
router.post('/login', validateMiddleware(loginSchema), loginUser);
router.post('/logout', authMiddleware, logoutUser);

export default router;