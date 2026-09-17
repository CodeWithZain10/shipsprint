const packageJsonTemplate = (answers) => {
    return `{
  "name": "${answers.projectName || 'shipsprint-backend'}",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"${answers.includeAuthentication ? `,
    "test": "vitest run",
    "seed": "node src/utils/seeders/user.seeder.js"` : ""}${answers.includeAuthentication && answers.includeRBAC ? `,
    "make-admin": "node src/utils/scripts/makeAdmin.js"` : ""}
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-rate-limit": "^8.6.2",
    "helmet": "^8.3.0",
    "joi": "^18.2.3",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.8.0"${answers.includeLogger ? `,
    "winston": "^3.19.0"` : ""}
  },
  "devDependencies": {${answers.includeAuthentication ? `
    "@faker-js/faker": "^10.5.0",` : ""}
    "nodemon": "^3.1.10"${answers.includeAuthentication ? `,
    "supertest": "^7.2.2",
    "vitest": "^4.1.11"` : ""}
  }
}`
}

export default packageJsonTemplate;
