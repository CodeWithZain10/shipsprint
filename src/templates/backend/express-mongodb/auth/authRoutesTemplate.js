const authRoutesTemplate = (includeValidation) => {
    return `import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
${includeValidation ? "import validateMiddleware from '../middlewares/validate.middleware.js'": ""}
${includeValidation ? "import { registerSchema, loginSchema } from '../utils/validation/auth.validation.js'": ""}

const router = express.Router();


router.post('/signup', ${includeValidation ? 'validateMiddleware(registerSchema),' : ''} registerUser);
router.post('/signin', ${includeValidation ? 'validateMiddleware(loginSchema),' : ''} loginUser);
router.post('/signout', authMiddleware, logoutUser);


export default router;`
}

export default authRoutesTemplate;