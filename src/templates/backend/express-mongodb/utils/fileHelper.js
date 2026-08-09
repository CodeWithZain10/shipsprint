import fs from 'fs';
import path from 'path';
import getAuthMiddlewareContent from '../auth/authMiddlewareTemplate.js';
import userModelTemplate from '../auth/userModelTemplate.js';
import authRoutesTemplate from '../auth/authRoutesTemplate.js';
import authControllerTemplate from '../auth/authControllerTemplate.js';
import appCodeTemplate from '../base/appCodeTemplate.js';
import serverCodeTemplate from '../base/serverCodeTemplate.js';
import dbConfigTemplate from '../base/dbConfigTemplate.js';
import envTemplate from '../base/env/envTemplate.js';
import packageJsonTemplate from '../base/packages/packageJsonTemplate.js';
import validateMiddlewareTemplate from '../validation/validateMiddlewareTemplate.js';
import errHandlerTemplate from './errors/errorHandlerMiddlewareTemplate.js';
import authValidationTemplate from '../auth/authValidationTemplate.js';
import appErrorTemplate from './errors/appErrorTemplate.js';
import envValidationTemplate from '../validation/envValidationTemplate.js';
import userSeederTemplate from './seeders/userSeederTemplate.js';

const createProjectStructure = (projectName, includeAuthentication, includeValidation, includeErrorHandler) => {

    const baseDir = path.join(process.cwd(), projectName);

    const file = fs.mkdirSync(baseDir, { recursive: true });
    const srcDir = fs.mkdirSync(path.join(baseDir, 'src'), { recursive: true });
    const routesDir = fs.mkdirSync(path.join(baseDir, 'src', 'routes'), { recursive: true });
    const controllersDir = fs.mkdirSync(path.join(baseDir, 'src', 'controllers'), { recursive: true });
    const modelsDir = fs.mkdirSync(path.join(baseDir, 'src', 'models'), { recursive: true });
    const middlewaresDir = fs.mkdirSync(path.join(baseDir, 'src', 'middlewares'), { recursive: true });
    const configDir = fs.mkdirSync(path.join(baseDir, 'src', 'config'), { recursive: true });
    const utilsDir = fs.mkdirSync(path.join(baseDir, 'src', 'utils'), { recursive: true });
    const testsDir = fs.mkdirSync(path.join(baseDir, 'tests'), { recursive: true });

    if(includeAuthentication) {
        const userModelContent = userModelTemplate()
        const authRoutesContent = authRoutesTemplate(includeValidation);
        const authControllerContent = authControllerTemplate(includeErrorHandler);
        const AuthMiddlewareContent = getAuthMiddlewareContent();
        const envValidationContent = envValidationTemplate();
        const userSeederContent = userSeederTemplate()

        fs.writeFileSync(path.join(baseDir, "src", "middlewares", "auth.middleware.js"), AuthMiddlewareContent)
        fs.writeFileSync(path.join(baseDir, "src", "models", "user.model.js"), userModelContent)
        fs.writeFileSync(path.join(baseDir, "src", "routes", "auth.routes.js"), authRoutesContent)
        fs.writeFileSync(path.join(baseDir, "src", "controllers", "auth.controller.js"), authControllerContent)

        fs.mkdirSync(path.join(baseDir, 'src', 'utils', 'validation'), { recursive: true })
        fs.writeFileSync(path.join(baseDir, "src", "utils", "validation", "env.validation.js"), envValidationContent)
        
        fs.mkdirSync(path.join(baseDir, "src", "utils", "seeders", { recursive: true }))
        fs.writeFileSync(path.join(baseDir, "src", "utils", "seeders", "user.seeder.js"), userSeederContent)
    }

    if(includeValidation) {
        const validateMiddlewareContent = validateMiddlewareTemplate();
        const authValidationContent = authValidationTemplate();
        fs.mkdirSync(path.join(baseDir, 'src', 'utils', 'validation'), { recursive: true })
        fs.writeFileSync(path.join(baseDir, "src", "utils", "validation", "auth.validation.js"), authValidationContent)
        fs.writeFileSync(path.join(baseDir, "src", "middlewares", "validate.middleware.js"), validateMiddlewareContent)
    }

    if(includeErrorHandler) {
        const errHandlerContent = errHandlerTemplate();
        const appErrorContent = appErrorTemplate();
        fs.mkdirSync(path.join(baseDir, 'src', 'middlewares'), { recursive: true })
        fs.writeFileSync(path.join(baseDir, "src", "middlewares", "errorHandler.middleware.js"), errHandlerContent)
        fs.mkdirSync(path.join(baseDir, 'src', 'utils', 'errors'), { recursive: true })
        fs.writeFileSync(path.join(baseDir, "src", "utils", "errors", "AppError.js"), appErrorContent)
    }

    const appCodeContent = appCodeTemplate(includeAuthentication, includeErrorHandler);
    const serverCodeContent = serverCodeTemplate(includeAuthentication);
    const dbConfigContent = dbConfigTemplate();
    
    fs.writeFileSync(path.join(baseDir, "src", "app.js"), appCodeContent)
    fs.writeFileSync(path.join(baseDir, "server.js"), serverCodeContent)
    fs.writeFileSync(path.join(baseDir, "src", "config", "db.js"), dbConfigContent)

    const envContent = envTemplate(includeAuthentication);
    fs.writeFileSync(path.join(baseDir, ".env"), envContent)

    const packageJsonContent = packageJsonTemplate(projectName, includeAuthentication, includeValidation);
    fs.writeFileSync(path.join(baseDir, "package.json"), packageJsonContent)

    
}

export default createProjectStructure;