const authRoutesTemplate = (includeValidation) => {
    return `import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
${includeValidation ? "import validateMiddleware from '../middlewares/validate.middleware.js'": ""}
${includeValidation ? "import { registerSchema, loginSchema } from '../utils/validation/auth.validation.js'": ""}

const router = express.Router();


router.post('/register', ${includeValidation ? 'validateMiddleware(registerSchema),' : ''} registerUser);
router.post('/login', ${includeValidation ? 'validateMiddleware(loginSchema),' : ''} loginUser);
router.post('/logout', authMiddleware, logoutUser);

export default router;`
}

export default authRoutesTemplate;