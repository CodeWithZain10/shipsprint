/*
 * src/templates/fileHelper.js
 *
 * Utility that scaffolds a project directory structure by writing
 * files produced by template functions. This module is intentionally
 * synchronous and minimal: it creates directories and writes files
 * using the templates available under ./backend and ./frontend.
 *
 * Contributors:
 * - When adding templates: export a function that returns the file content string.
 * - Keep the naming conventions aligned with the existing templates.
 *
 * Notes / gotchas:
 * - All file writes are synchronous (blocking). That's fine for a CLI
 *   generator but avoid using this module in long-running servers.
 * - `fs.writeFileSync` expects a full file path as the first argument.
 *   There are a few places below where directory variables are passed
 *   to `writeFileSync` — double-check those if you change the React part.
 */

import fs, { mkdirSync } from 'fs';
import path from 'path';
// Backend template providers (each returns file content when invoked)
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

// Frontend React templates
import reactAppTemplate from '../templates/frontend/react-vite/base/src/appTemplate.js'
import reactMainTemplate from '../templates/frontend/react-vite/base/src/mainTemplate.js'
import indexCSSTemplate from '../templates/frontend/react-vite/base/src/indexCSSTemplate.js'
import reactSignInPageTemplate from '../templates/frontend/react-vite/features/pages/auth/signinPageTemplate.js';
import reactSignupPageTemplate from '../templates/frontend/react-vite/features/pages/auth/signupPageTemplate.js';
import reactDashboardPageTemplate from '../templates/frontend/react-vite/features/pages/dashboardPageTemplate.js';
import reactHomePageTemplate from '../templates/frontend/react-vite/features/pages/homePageTemplate.js';



import reactindexHTMLTemplate from '../templates/frontend/react-vite/base/indexHTMLTemplate.js'
import reactESLINTCongigTemplate from '../templates/frontend/react-vite/base/esLintConfigTemplate.js';
import reactGitIgnoreTemplate from '../templates/frontend/react-vite/base/gitIgnoreTemplate.js';
import reactPackageJSONTemplate from '../templates/frontend/react-vite/base/packageJSONTemplate.js';
import reactViteConfigTemplate from '../templates/frontend/react-vite/base/viteConfigTemplate.js';




/**
 * createProjectStructure
 *
 * Create a new project scaffold at `process.cwd()/projectName`.
 *
 * Parameters:
 * - projectName: string - name of the directory to create
 * - includeAuthentication: boolean - include auth templates (models, routes, controllers, middleware)
 * - includeValidation: boolean - include validation middleware and templates
 * - includeErrorHandler: boolean - include error handler middleware and AppError util
 *
 * The function writes files and creates directories synchronously using
 * the template functions imported above.
 */
const generateProject = (answers) => {

    // Base path for the generated project
    const baseDirBackendExpress = path.join(process.cwd(), answers.projectName, "backend");

    // Create top-level and common subdirectories (idempotent due to { recursive: true })
    const file = fs.mkdirSync(baseDirBackendExpress, { recursive: true });
    const srcDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'src'), { recursive: true });
    const routesDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'routes'), { recursive: true });
    const controllersDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'controllers'), { recursive: true });
    const modelsDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'models'), { recursive: true });
    const middlewaresDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'middlewares'), { recursive: true });
    const configDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'config'), { recursive: true });
    const utilsDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'src', 'utils'), { recursive: true });
    const testsDir = fs.mkdirSync(path.join(baseDirBackendExpress, 'tests'), { recursive: true });

    // --- Authentication-related files ---
    if(answers.includeAuthentication) {
        // Generate content from templates
        const userModelContent = userModelTemplate()
        const authRoutesContent = authRoutesTemplate(answers.includeValidation);
        const authControllerContent = authControllerTemplate(answers.includeErrorHandler);
        const AuthMiddlewareContent = getAuthMiddlewareContent();
        const envValidationContent = envValidationTemplate();
        const userSeederContent = userSeederTemplate()

        // Write the auth-related files to the scaffold
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "middlewares", "auth.middleware.js"), AuthMiddlewareContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "models", "user.model.js"), userModelContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "routes", "auth.routes.js"), authRoutesContent)
        fs.writeFileSync(path.join(baseDirBackendExpress, "src", "controllers", "auth.controller.js"), authControllerContent)

        // Ensure validation and seeders folders exist and write their templates
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
    // Note: this part creates a simple frontend structure inside the same
    // project directory. If you plan to split frontend/backend into separate
    // repos, change this behavior.
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

    
    const baseDirReact = path.join(process.cwd(), answers.projectName, "frontend")

    // Create frontend folders under the same project root
    const reactFile = mkdirSync(baseDirReact, { recursive: true })
    const reactSrcDir = mkdirSync(path.join(baseDirReact, "src"), { recursive: true })
    const assetsDir = mkdirSync(path.join(reactSrcDir, "assets"), { recursive: true })
    const componentsDir = mkdirSync(path.join(reactSrcDir, "components"), { recursive: true })
    const layoutsDir = mkdirSync(path.join(reactSrcDir, "layouts"), { recursive: true })
    const reactRoutesDir = mkdirSync(path.join(reactSrcDir, "routes"), { recursive: true })
    const reactServicesDir = mkdirSync(path.join(reactSrcDir, "services"), { recursive: true })
    const reactHooksDir = mkdirSync(path.join(reactSrcDir, "hooks"), { recursive: true })
    const reactUtilsDir = mkdirSync(path.join(reactSrcDir, "utils"), { recursive: true })
    const pagesDir = mkdirSync(path.join(reactSrcDir, "pages"), { recursive: true })
    const authPageDir = mkdirSync(path.join(pagesDir, "auth"), { recursive: true })

    // NOTE: writeFileSync expects a path string; these calls currently pass
    // the directory variable as the first argument. If you run into issues
    // creating the frontend files, update the arguments to use
    // path.join(reactSrcDir, 'app.jsx') etc.

    fs.writeFileSync(path.join(baseDirReact, "eslint.config.js"), esLintConfigTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, "index.html"), ReactIndexHTMLTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, ".gitignore"), ReactGitIgnoreTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, "package.json"), reactPackageJSONTemplateContent)
    fs.writeFileSync(path.join(baseDirReact, "vite.config.js"), reactViteConfigTemplateContent)

    fs.writeFileSync(path.join(reactSrcDir, "app.jsx"), reactAppTemplateContent)
    fs.writeFileSync(path.join(reactSrcDir, "main.jsx"), reactMainTemplateContent)
    fs.writeFileSync(path.join(reactSrcDir, "index.css"), indexCSSTemplateContent)
    fs.writeFileSync(path.join(authPageDir, 'Signin.jsx'), reactSignInPageTemplateContent)
    fs.writeFileSync(path.join(authPageDir, 'Signup.jsx'), reactSignUpPageTemplateContent)
    fs.writeFileSync(path.join(pagesDir, 'Dashboard.jsx'), reactDashboardPageTemplateContent)
    



}

export default generateProject;