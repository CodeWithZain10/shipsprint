const adminRoutesTemplate = () => {
    return `import express from "express";
import { listUsers, updateUserRole } from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import csrfMiddleware from "../middlewares/csrf.middleware.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/users', listUsers);
router.patch('/users/:id/role', csrfMiddleware, updateUserRole);

export default router;`
}

export default adminRoutesTemplate;
