const authRoutesTemplate = (includeValidation) => {
    return `import express from "express";
import { signupUser, signinUser, signoutUser, refreshAccessTokenController, profile, getCsrfToken } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
${includeValidation ? "import validateMiddleware from '../middlewares/validate.middleware.js'" : ""}
${includeValidation ? "import { registerSchema, loginSchema } from '../utils/validation/auth.validation.js'" : ""}
import { signinRateLimit, signupRateLimit, refreshTokenRateLimit } from "../middlewares/rateLimit.middleware.js";
import csrfMiddleware from "../middlewares/csrf.middleware.js";

const router = express.Router();

router.post('/signup', signupRateLimit, ${includeValidation ? 'validateMiddleware(registerSchema),' : ''} signupUser);
router.post('/signin', signinRateLimit, ${includeValidation ? 'validateMiddleware(loginSchema),' : ''} signinUser);
router.post('/refresh', refreshTokenRateLimit, csrfMiddleware, refreshAccessTokenController);
router.post('/signout', csrfMiddleware, signoutUser);
router.get('/profile', authMiddleware, profile);
router.get('/csrf', getCsrfToken);

export default router;`
}

export default authRoutesTemplate;