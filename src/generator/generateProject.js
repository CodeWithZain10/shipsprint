/*
 * src/generator/generateProject.js
 *
 * Scaffolds project directory structure and writes template files for backend and frontend.
 */

import fs, { mkdirSync } from 'fs';
import path from 'path';

// Backend template providers
import getAuthMiddlewareContent from '../templates/backend/express-mongodb/auth/authMiddlewareTemplate.js';
import userModelTemplate from '../templates/backend/express-mongodb/auth/userModelTemplate.js';
import authRoutesTemplate from '../templates/backend/express-mongodb/auth/authRoutesTemplate.js';
import authControllerTemplate from '../templates/backend/express-mongodb/auth/authControllerTemplate.js';
import appCodeTemplate from '../templates/backend/express-mongodb/base/appCodeTemplate.js';
import serverCodeTemplate from '../templates/backend/express-mongodb/base/serverCodeTemplate.js';
import dbConfigTemplate from '../templates/backend/express-mongodb/base/dbConfigTemplate.js';
import envTemplate from '../templates/backend/express-mongodb/base/env/envTemplate.js';
import packageJsonTemplate from '../templates/backend/express-mongodb/base/packages/packageJsonTemplate.js';
import validateMiddlewareTemplate from '../templates/backend/express-mongodb/validation/validateMiddlewareTemplate.js';
import errHandlerTemplate from '../templates/backend/express-mongodb/utils/errors/errorHandlerMiddlewareTemplate.js';
import authValidationTemplate from '../templates/backend/express-mongodb/auth/authValidationTemplate.js';
import appErrorTemplate from '../templates/backend/express-mongodb/utils/errors/appErrorTemplate.js';
import envValidationTemplate from '../templates/backend/express-mongodb/validation/envValidationTemplate.js';
import userSeederTemplate from '../templates/backend/express-mongodb/utils/seeders/userSeederTemplate.js';

import cookieConfigTemplate from '../templates/backend/express-mongodb/config/cookieConfigTemplate.js';
import csrfMiddlewareTemplate from '../templates/backend/express-mongodb/middlewares/csrfMiddlewareTemplate.js';
import rateLimitMiddlewareTemplate from '../templates/backend/express-mongodb/middlewares/rateLimitMiddlewareTemplate.js';
import refreshTokenModelTemplate from '../templates/backend/express-mongodb/auth/refreshTokenModelTemplate.js';
import authServiceTemplate from '../templates/backend/express-mongodb/services/authServiceTemplate.js';
import tokenServiceTemplate from '../templates/backend/express-mongodb/services/tokenServiceTemplate.js';
import csrfTemplate from '../templates/backend/express-mongodb/utils/csrfTemplate.js';
import durationTemplate from '../templates/backend/express-mongodb/utils/durationTemplate.js';

// Test templates
import vitestConfigTemplate from '../templates/backend/express-mongodb/tests/vitestConfigTemplate.js';
import setupTemplate from '../templates/backend/express-mongodb/tests/setupTemplate.js';
import envTestTemplate from '../templates/backend/express-mongodb/tests/envTestTemplate.js';
import signupTestTemplate from '../templates/backend/express-mongodb/tests/signupTestTemplate.js';
import signinTestTemplate from '../templates/backend/express-mongodb/tests/signinTestTemplate.js';
import signoutTestTemplate from '../templates/backend/express-mongodb/tests/signoutTestTemplate.js';
import refreshTestTemplate from '../templates/backend/express-mongodb/tests/refreshTestTemplate.js';
import accessTokenTestTemplate from '../templates/backend/express-mongodb/tests/accessTokenTestTemplate.js';
import csrfTestTemplate from '../templates/backend/express-mongodb/tests/csrfTestTemplate.js';
import rateLimitTestTemplate from '../templates/backend/express-mongodb/tests/rateLimitTestTemplate.js';
import profileTestTemplate from '../templates/backend/express-mongodb/tests/profileTestTemplate.js';

// Frontend React templates
import reactAppTemplate from '../templates/frontend/react-vite/base/src/appTemplate.js'
import reactMainTemplate from '../templates/frontend/react-vite/base/src/mainTemplate.js'
import indexCSSTemplate from '../templates/frontend/react-vite/base/src/indexCSSTemplate.js'
import reactSignInPageTemplate from '../templates/frontend/react-vite/features/pages/auth/signinPageTemplate.js';
import reactSignupPageTemplate from '../templates/frontend/react-vite/features/pages/auth/signupPageTemplate.js';
import reactDashboardPageTemplate from '../templates/frontend/react-vite/features/pages/dashboardPageTemplate.js';
import reactHomePageTemplate from '../templates/frontend/react-vite/features/pages/homePageTemplate.js';
import reactAuthContextTemplate from '../templates/frontend/react-vite/features/context/authContextTemplate.js';
import reactProtectedRouteTemplate from '../templates/frontend/react-vite/features/routes/protectedRouteTemplate.js';
import reactAxiosApiTemplate from '../templates/frontend/react-vite/features/services/axiosApiTemplate.js';
import reactCsrfApiTemplate from '../templates/frontend/react-vite/features/services/csrfApiTemplate.js';

import reactindexHTMLTemplate from '../templates/frontend/react-vite/base/indexHTMLTemplate.js'
import reactESLINTCongigTemplate from '../templates/frontend/react-vite/base/esLintConfigTemplate.js';
import reactGitIgnoreTemplate from '../templates/frontend/react-vite/base/gitIgnoreTemplate.js';
import reactPackageJSONTemplate from '../templates/frontend/react-vite/base/packageJSONTemplate.js';
import reactViteConfigTemplate from '../templates/frontend/react-vite/base/viteConfigTemplate.js';

/**
 * generateProject
 */
const generateProject = (answers) => {

    // Base path for the generated project
    const baseDirBackendExpress = path.join(process.cwd(), answers.projectName, "backend");

    // Create subdirectories
    fs.mkdirSync(baseDirBackendExpress, { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src'), { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'routes'), { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'controllers'), { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'models'), { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'middlewares'), { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'config'), { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'services'), { recursive: true });
    fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'utils'), { recursive: true });
    
    const testsDir = path.join(baseDirBackendExpress, 'tests');
    const testsAuthDir = path.join(testsDir, 'auth');
    fs.mkdirSync(testsAuthDir, { recursive: true });

    // --- Authentication-related files ---
    if(answers.includeAuthentication) {
        // Generate content from templates
        const userModelContent = userModelTemplate()
        const authRoutesContent = authRoutesTemplate(answers.includeValidation);
        const authControllerContent = authControllerTemplate(answers.includeErrorHandler);
        const AuthMiddlewareContent = getAuthMiddlewareContent();
        const envValidationContent = envValidationTemplate();
        const userSeederContent = userSeederTemplate()
        const cookieConfigContent = cookieConfigTemplate();
        const csrfMiddlewareContent = csrfMiddlewareTemplate();
        const rateLimitMiddlewareContent = rateLimitMiddlewareTemplate();
        const refreshTokenModelContent = refreshTokenModelTemplate();
        const authServiceContent = authServiceTemplate();
        const tokenServiceContent = tokenServiceTemplate();
        const csrfUtilContent = csrfTemplate();
        const durationUtilContent = durationTemplate();

        // Write the auth-related files
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "auth.middleware.js"), AuthMiddlewareContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "csrf.middleware.js"), csrfMiddlewareContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "rateLimit.middleware.js"), rateLimitMiddlewareContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "models", "user.model.js"), userModelContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "models", "refreshToken.model.js"), refreshTokenModelContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "routes", "auth.routes.js"), authRoutesContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "controllers", "auth.controller.js"), authControllerContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "config", "cookie.config.js"), cookieConfigContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "services", "auth.service.js"), authServiceContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "services", "token.service.js"), tokenServiceContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "csrf.js"), csrfUtilContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "duration.js"), durationUtilContent)

        // Write test files
        fs.writeFileSync(path.join(baseDirBackendExpress, "vitest.config.js"), vitestConfigTemplate())
        fs.writeFileSync(path.join(baseDirBackendExpress, ".env.test"), envTestTemplate())
        fs.writeFileSync(path.join(testsDir, "setup.js"), setupTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "signup.test.js"), signupTestTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "signin.test.js"), signinTestTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "signout.test.js"), signoutTestTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "refresh.test.js"), refreshTestTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "accessToken.test.js"), accessTokenTestTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "csrf.test.js"), csrfTestTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "rateLimit.test.js"), rateLimitTestTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "profile.test.js"), profileTestTemplate())

        // Validation & Seeders
        fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'utils', 'validation'), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "validation", "env.validation.js"), envValidationContent)
        
        fs.mkdirSync(path.join(baseDirBackendExpress, "src", "utils", "seeders"), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "seeders", "user.seeder.js"), userSeederContent)
    }

    // --- Validation-related files ---
    if(answers.includeValidation) {
        const validateMiddlewareContent = validateMiddlewareTemplate();
        const authValidationContent = authValidationTemplate();
        fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'utils', 'validation'), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "validation", "auth.validation.js"), authValidationContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "validate.middleware.js"), validateMiddlewareContent)
    }

    // --- Error handler files ---
    if(answers.includeErrorHandler) {
        const errHandlerContent = errHandlerTemplate();
        const appErrorContent = appErrorTemplate();
        fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'middlewares'), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "errorHandler.middleware.js"), errHandlerContent)
        fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'utils', 'errors'), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "errors", "AppError.js"), appErrorContent)
    }

    // --- Core app files ---
    const appCodeContent = appCodeTemplate(answers);
    const serverCodeContent = serverCodeTemplate(answers);
    const dbConfigContent = dbConfigTemplate();
    
    fs.writeFileSync(path.join(baseDirBackendExpress, "src", "app.js"), appCodeContent)
    fs.writeFileSync(path.join(baseDirBackendExpress, "server.js"), serverCodeContent)
    fs.writeFileSync(path.join(baseDirBackendExpress, "src", "config", "db.js"), dbConfigContent)

    // Environment and package manifest
    const envContent = envTemplate(answers.includeAuthentication);
    fs.writeFileSync(path.join(baseDirBackendExpress, ".env"), envContent)

    const packageJsonContent = packageJsonTemplate(answers);
    fs.writeFileSync(path.join(baseDirBackendExpress, "package.json"), packageJsonContent)

    // --- React (frontend) templates embedding ---
    const reactAppTemplateContent = reactAppTemplate()
    const reactMainTemplateContent = reactMainTemplate()
    const indexCSSTemplateContent = indexCSSTemplate()

    const esLintConfigTemplateContent = reactESLINTCongigTemplate()
    const ReactGitIgnoreTemplateContent = reactGitIgnoreTemplate()
    const ReactIndexHTMLTemplateContent = reactindexHTMLTemplate()
    const reactPackageJSONTemplateContent = reactPackageJSONTemplate()
    const reactViteConfigTemplateContent = reactViteConfigTemplate()
    const reactSignInPageTemplateContent = reactSignInPageTemplate()
    const reactSignUpPageTemplateContent = reactSignupPageTemplate()
    const reactDashboardPageTemplateContent = reactDashboardPageTemplate()
    const reactHomePageTemplateContent = reactHomePageTemplate()
    const reactAuthContextTemplateContent = reactAuthContextTemplate()
    const reactProtectedRouteTemplateContent = reactProtectedRouteTemplate()
    const reactAxiosApiTemplateContent = reactAxiosApiTemplate()
    const reactCsrfApiTemplateContent = reactCsrfApiTemplate()

    const baseDirReact = path.join(process.cwd(), answers.projectName, "frontend")

    mkdirSync(baseDirReact, { recursive: true })
    const reactSrcDir = mkdirSync(path.join(baseDirReact, "src"), { recursive: true })
    mkdirSync(path.join(reactSrcDir, "assets"), { recursive: true })
    mkdirSync(path.join(reactSrcDir, "components"), { recursive: true })
    mkdirSync(path.join(reactSrcDir, "layouts"), { recursive: true })
    const reactRoutesDir = mkdirSync(path.join(reactSrcDir, "routes"), { recursive: true })
    const reactServicesDir = mkdirSync(path.join(reactSrcDir, "services"), { recursive: true })
    mkdirSync(path.join(reactSrcDir, "hooks"), { recursive: true })
    mkdirSync(path.join(reactSrcDir, "utils"), { recursive: true })
    const reactContextDir = mkdirSync(path.join(reactSrcDir, "context"), { recursive: true })
    const pagesDir = mkdirSync(path.join(reactSrcDir, "pages"), { recursive: true })
    const authPageDir = mkdirSync(path.join(pagesDir, "auth"), { recursive: true })

    fs.writeFileSync(path.join(baseDirReact, "eslint.config.js"), esLintConfigTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, "index.html"), ReactIndexHTMLTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, ".gitignore"), ReactGitIgnoreTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, "package.json"), reactPackageJSONTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, "vite.config.js"), reactViteConfigTemplateContent)

    fs.writeFileSync(path.join(reactSrcDir, "App.jsx"), reactAppTemplateContent)
    fs.writeFileSync(path.join(reactSrcDir, "main.jsx"), reactMainTemplateContent)
    fs.writeFileSync(path.join(reactSrcDir, "index.css"), indexCSSTemplateContent)
    fs.writeFileSync(path.join(authPageDir, 'Signin.jsx'), reactSignInPageTemplateContent)
    fs.writeFileSync(path.join(authPageDir, 'Signup.jsx'), reactSignUpPageTemplateContent)
    fs.writeFileSync(path.join(pagesDir, 'Dashboard.jsx'), reactDashboardPageTemplateContent)
    fs.writeFileSync(path.join(pagesDir, 'Home.jsx'), reactHomePageTemplateContent )

    fs.writeFileSync(path.join(reactContextDir, "AuthContext.jsx"), reactAuthContextTemplateContent)
    fs.writeFileSync(path.join(reactRoutesDir, "ProtectedRoute.jsx"), reactProtectedRouteTemplateContent)
    fs.writeFileSync(path.join(reactServicesDir, "Api.jsx"), reactAxiosApiTemplateContent)
    fs.writeFileSync(path.join(reactServicesDir, "csrf.jsx"), reactCsrfApiTemplateContent)
}

export default generateProject;