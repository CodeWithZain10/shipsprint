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
import appErrorTemplate from '../templates/backend/express-mongodb/utils/errors/AppErrorTemplate.js';
import envValidationTemplate from '../templates/backend/express-mongodb/validation/envValidationTemplate.js';
import userSeederTemplate from '../templates/backend/express-mongodb/utils/seeders/userSeederTemplate.js';

import cookieConfigTemplate from '../templates/backend/express-mongodb/config/cookieConfigTemplate.js';
import csrfMiddlewareTemplate from '../templates/backend/express-mongodb/middlewares/csrfMiddlewareTemplate.js';
import rateLimitMiddlewareTemplate from '../templates/backend/express-mongodb/middlewares/rateLimitMiddlewareTemplate.js';
import refreshTokenModelTemplate from '../templates/backend/express-mongodb/auth/refreshTokenModelTemplate.js';
import authServiceTemplate from '../templates/backend/express-mongodb/services/authServiceTemplate.js';
import tokenServiceTemplate from '../templates/backend/express-mongodb/services/tokenServiceTemplate.js';
import emailServiceTemplate from '../templates/backend/express-mongodb/services/emailServiceTemplate.js';
import csrfTemplate from '../templates/backend/express-mongodb/utils/csrfTemplate.js';
import durationTemplate from '../templates/backend/express-mongodb/utils/durationTemplate.js';
import healthRoutesTemplate from '../templates/backend/express-mongodb/routes/healthRoutesTemplate.js';
import loggerTemplate from '../templates/backend/express-mongodb/utils/loggerTemplate.js';
import requestLoggerMiddlewareTemplate from '../templates/backend/express-mongodb/middlewares/requestLoggerMiddlewareTemplate.js';
import roleMiddlewareTemplate from '../templates/backend/express-mongodb/middlewares/roleMiddlewareTemplate.js';
import adminControllerTemplate from '../templates/backend/express-mongodb/auth/adminControllerTemplate.js';
import adminRoutesTemplate from '../templates/backend/express-mongodb/auth/adminRoutesTemplate.js';
import makeAdminTemplate from '../templates/backend/express-mongodb/utils/scripts/makeAdminTemplate.js';
import dockerfileTemplate from '../templates/backend/express-mongodb/docker/dockerfileTemplate.js';
import dockerignoreTemplate from '../templates/backend/express-mongodb/docker/dockerignoreTemplate.js';
import dockerComposeTemplate from '../templates/backend/express-mongodb/docker/dockerComposeTemplate.js';

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
import roleTestTemplate from '../templates/backend/express-mongodb/tests/roleTestTemplate.js';

// Frontend React templates
import reactAppTemplate from '../templates/frontend/react-vite/base/src/appTemplate.js'
import reactMainTemplate from '../templates/frontend/react-vite/base/src/mainTemplate.js'
import indexCSSTemplate from '../templates/frontend/react-vite/base/src/indexCSSTemplate.js'
import reactSignInPageTemplate from '../templates/frontend/react-vite/features/pages/auth/signinPageTemplate.js';
import reactSignupPageTemplate from '../templates/frontend/react-vite/features/pages/auth/signupPageTemplate.js';
import reactDashboardPageTemplate from '../templates/frontend/react-vite/features/pages/dashboardPageTemplate.js';
import reactHomePageTemplate from '../templates/frontend/react-vite/features/pages/homePageTemplate.js';
import reactForgotPasswordPageTemplate from '../templates/frontend/react-vite/features/pages/forgotPasswordPageTemplate.js';
import reactResetPasswordPageTemplate from '../templates/frontend/react-vite/features/pages/resetPasswordPageTemplate.js';
import reactAuthContextTemplate from '../templates/frontend/react-vite/features/context/authContextTemplate.js';
import reactProtectedRouteTemplate from '../templates/frontend/react-vite/features/routes/protectedRouteTemplate.js';
import reactAxiosApiTemplate from '../templates/frontend/react-vite/features/services/axiosApiTemplate.js';
import reactCsrfApiTemplate from '../templates/frontend/react-vite/features/services/csrfApiTemplate.js';
import reactSystemApiTemplate from '../templates/frontend/react-vite/features/services/systemApiTemplate.js';
import reactVerificationBannerTemplate from '../template/frontend/react-vite/features/components/verificationBannerTemplate.js'
import reactSystemStatusTemplate from '../templates/frontend/react-vite/features/components/systemStatusTemplate.js';
import reactAdminPageTemplate from '../templates/frontend/react-vite/features/pages/adminPageTemplate.js';
import reactDockerfileTemplate from '../templates/frontend/react-vite/docker/dockerfileTemplate.js';
import reactDockerignoreTemplate from '../templates/frontend/react-vite/docker/dockerignoreTemplate.js';
import reactNginxConfTemplate from '../templates/frontend/react-vite/docker/nginxConfTemplate.js';

import reactindexHTMLTemplate from '../templates/frontend/react-vite/base/indexHTMLTemplate.js'
import reactESLINTCongigTemplate from '../templates/frontend/react-vite/base/esLintConfigTemplate.js';
import reactGitIgnoreTemplate from '../templates/frontend/react-vite/base/gitIgnoreTemplate.js';
import reactPackageJSONTemplate from '../templates/frontend/react-vite/base/packageJSONTemplate.js';
import reactViteConfigTemplate from '../templates/frontend/react-vite/base/viteConfigTemplate.js';

/**
 * generateProject
 */
const generateProject = (answers) => {

    // RBAC only makes sense on top of authentication
    answers.includeRBAC = Boolean(answers.includeAuthentication && answers.includeRBAC);

    if(answers.includeBackend) {
        generateBackend(answers);

        if(answers.includeDocker) {
            generateDocker(answers);
        }
    }

    if(answers.includeFrontend) {
        generateFrontend(answers);
    }
}

const generateBackend = (answers) => {

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

    // --- Authentication-related files ---
    if(answers.includeAuthentication) {
        // Generate content from templates
        const userModelContent = userModelTemplate(answers.includeRBAC)
        const authRoutesContent = authRoutesTemplate(answers.includeValidation);
        const authControllerContent = authControllerTemplate(answers.includeRBAC);
        const AuthMiddlewareContent = getAuthMiddlewareContent();
        const envValidationContent = envValidationTemplate();
        const userSeederContent = userSeederTemplate(answers.includeRBAC)
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
        fs.mkdirSync(testsAuthDir, { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "vitest.config.js"), vitestConfigTemplate())
        fs.writeFileSync(path.join(baseDirBackendExpress, ".env.test"), envTestTemplate())
        fs.writeFileSync(path.join(testsDir, "setup.js"), setupTemplate())
        fs.writeFileSync(path.join(testsAuthDir, "signup.test.js"), signupTestTemplate(answers.includeValidation))
        fs.writeFileSync(path.join(testsAuthDir, "signin.test.js"), signinTestTemplate(answers.includeValidation))
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

        // --- Role-based access control ---
        if(answers.includeRBAC) {
            fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "role.middleware.js"), roleMiddlewareTemplate())
            fs.writeFileSync(path.join(baseDirBackendExpress, "src", "controllers", "admin.controller.js"), adminControllerTemplate())
            fs.writeFileSync(path.join(baseDirBackendExpress, "src", "routes", "admin.routes.js"), adminRoutesTemplate())
            fs.writeFileSync(path.join(testsAuthDir, "role.test.js"), roleTestTemplate(answers.includeValidation))

            fs.mkdirSync(path.join(baseDirBackendExpress, "src", "utils", "scripts"), { recursive: true })
            fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "scripts", "makeAdmin.js"), makeAdminTemplate())
        }
    }

    // --- Validation-related files ---
    if(answers.includeValidation) {
        const validateMiddlewareContent = validateMiddlewareTemplate();
        const authValidationContent = authValidationTemplate();
        fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'utils', 'validation'), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "validation", "auth.validation.js"), authValidationContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "validate.middleware.js"), validateMiddlewareContent)
    }
    // --- Email-related files ---
    if(answers.includeEmail) {
    fs.writeFileSync(path.join(baseDirBackendExpress, "src", "services", "email.service.js"), emailServiceTemplate())
}

    // --- Error handler files (auth depends on AppError + errorHandler) ---
    if(answers.includeErrorHandler || answers.includeAuthentication) {
        const errHandlerContent = errHandlerTemplate();
        const appErrorContent = appErrorTemplate();
        fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'middlewares'), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "errorHandler.middleware.js"), errHandlerContent)
        fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'utils', 'errors'), { recursive: true })
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "errors", "AppError.js"), appErrorContent)
    }

    // --- Logger files ---
    if(answers.includeLogger) {
        const loggerContent = loggerTemplate();
        const requestLoggerMiddlewareContent = requestLoggerMiddlewareTemplate();
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "utils", "logger.js"), loggerContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "requestLogger.middleware.js"), requestLoggerMiddlewareContent)
    }

    // --- Core app files ---
    const healthRoutesContent = healthRoutesTemplate(answers);
    fs.writeFileSync(path.join(baseDirBackendExpress, "src", "routes", "health.routes.js"), healthRoutesContent)

    const appCodeContent = appCodeTemplate(answers);
    const serverCodeContent = serverCodeTemplate(answers);
    const dbConfigContent = dbConfigTemplate();
    
    fs.writeFileSync(path.join(baseDirBackendExpress, "src", "app.js"), appCodeContent)
    fs.writeFileSync(path.join(baseDirBackendExpress, "server.js"), serverCodeContent)
    fs.writeFileSync(path.join(baseDirBackendExpress, "src", "config", "db.js"), dbConfigContent)

    // Environment and package manifest
    const envContent = envTemplate(answers.includeAuthentication, answers.projectName, answers.includeEmail);
    fs.writeFileSync(path.join(baseDirBackendExpress, ".env"), envContent)

    const packageJsonContent = packageJsonTemplate(answers);
    fs.writeFileSync(path.join(baseDirBackendExpress, "package.json"), packageJsonContent)
}

const generateFrontend = (answers) => {

    // Auth UI only makes sense when there is an auth backend to talk to
    const includeAuthentication = Boolean(answers.includeBackend && answers.includeAuthentication)

    const baseDirReact = path.join(process.cwd(), answers.projectName, "frontend")
    const reactSrcDir = path.join(baseDirReact, "src")
    const reactComponentsDir = path.join(reactSrcDir, "components")
    const reactRoutesDir = path.join(reactSrcDir, "routes")
    const reactServicesDir = path.join(reactSrcDir, "services")
    const reactContextDir = path.join(reactSrcDir, "context")
    const pagesDir = path.join(reactSrcDir, "pages")
    const authPageDir = path.join(pagesDir, "auth")

    mkdirSync(path.join(reactSrcDir, "assets"), { recursive: true })
    mkdirSync(reactComponentsDir, { recursive: true })
    mkdirSync(path.join(reactSrcDir, "layouts"), { recursive: true })
    mkdirSync(reactServicesDir, { recursive: true })
    mkdirSync(path.join(reactSrcDir, "hooks"), { recursive: true })
    mkdirSync(path.join(reactSrcDir, "utils"), { recursive: true })
    mkdirSync(pagesDir, { recursive: true })

    // --- Base files ---
    fs.writeFileSync(path.join(baseDirReact, "eslint.config.js"), reactESLINTCongigTemplate())
    fs.writeFileSync(path.join(baseDirReact, "index.html"), reactindexHTMLTemplate())
    fs.writeFileSync(path.join(baseDirReact, ".gitignore"), reactGitIgnoreTemplate())
    fs.writeFileSync(path.join(baseDirReact, "package.json"), reactPackageJSONTemplate())
    fs.writeFileSync(path.join(baseDirReact, "vite.config.js"), reactViteConfigTemplate())

    fs.writeFileSync(path.join(reactSrcDir, "App.jsx"), reactAppTemplate(answers))
    fs.writeFileSync(path.join(reactSrcDir, "main.jsx"), reactMainTemplate(answers))
    fs.writeFileSync(path.join(reactSrcDir, "index.css"), indexCSSTemplate())
    fs.writeFileSync(path.join(pagesDir, 'Home.jsx'), reactHomePageTemplate(answers))

    // --- System status (health / version / api-info routes) ---
    fs.writeFileSync(path.join(reactServicesDir, "system.js"), reactSystemApiTemplate())
    fs.writeFileSync(path.join(reactComponentsDir, "SystemStatus.jsx"), reactSystemStatusTemplate())
    fs.writeFileSync(path.join(reactComponentsDir, "VerificationBanner.jsx"), reactVerificationBannerTemplate())

    // --- Authentication UI ---
    if(includeAuthentication) {
        mkdirSync(authPageDir, { recursive: true })
        mkdirSync(reactContextDir, { recursive: true })
        mkdirSync(reactRoutesDir, { recursive: true })

        fs.writeFileSync(path.join(authPageDir, 'Signin.jsx'), reactSignInPageTemplate())
        fs.writeFileSync(path.join(authPageDir, 'Signup.jsx'), reactSignupPageTemplate())
        fs.writeFileSync(path.join(pagesDir, 'Dashboard.jsx'), reactDashboardPageTemplate(answers.includeRBAC))
        fs.writeFileSync(path.join(pagesDir, 'ForgotPassword.jsx'), reactForgotPasswordPageTemplate())
        fs.writeFileSync(path.join(pagesDir, 'ResetPassword.jsx'), reactResetPasswordPageTemplate())
        fs.writeFileSync(path.join(reactContextDir, "AuthContext.jsx"), reactAuthContextTemplate(answers.includeRBAC))
        fs.writeFileSync(path.join(reactRoutesDir, "ProtectedRoute.jsx"), reactProtectedRouteTemplate(answers.includeRBAC))
        fs.writeFileSync(path.join(reactServicesDir, "api.js"), reactAxiosApiTemplate())
        fs.writeFileSync(path.join(reactServicesDir, "csrf.js"), reactCsrfApiTemplate())
    }

    // --- Role-based access control UI ---
    if(answers.includeRBAC) {
        fs.writeFileSync(path.join(pagesDir, 'Admin.jsx'), reactAdminPageTemplate())
    }

    // --- Docker (nginx serves the build and proxies API calls to the backend service) ---
    if(answers.includeDocker && answers.includeBackend) {
        fs.writeFileSync(path.join(baseDirReact, "Dockerfile"), reactDockerfileTemplate())
        fs.writeFileSync(path.join(baseDirReact, ".dockerignore"), reactDockerignoreTemplate())
        fs.writeFileSync(path.join(baseDirReact, "nginx.conf"), reactNginxConfTemplate())
    }
}

const generateDocker = (answers) => {
    const projectRoot = path.join(process.cwd(), answers.projectName)

    fs.mkdirSync(projectRoot, { recursive: true })
    fs.writeFileSync(path.join(projectRoot, "Dockerfile"), dockerfileTemplate())
    fs.writeFileSync(path.join(projectRoot, ".dockerignore"), dockerignoreTemplate())
    fs.writeFileSync(path.join(projectRoot, "docker-compose.yml"), dockerComposeTemplate(answers))
}

export default generateProject;
