const packageJsonTemplate = (answers) => {
    return `{
  "name": "${answers.projectName}",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": { 
  ${answers.includeValidation ? `
    "joi": "latest",` : ""}
    "express": "latest",
    "mongoose": "latest",
    "dotenv": "latest",
    "nodemon": "latest",
    "cors": "latest"${answers.includeAuthentication ? `,
    "bcryptjs": "latest",
    "@faker-js/faker": "latest",
    "jsonwebtoken": "latest",
    "cookie-parser": "latest"` : ""}
  }
}
`
}
export default packageJsonTemplate;