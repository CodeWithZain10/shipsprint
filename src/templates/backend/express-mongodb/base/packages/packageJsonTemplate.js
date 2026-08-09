const packageJsonTemplate = (projectName, includeAuthentication, includeValidation) => {
    return `{
  "name": "${projectName}",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
  ${includeValidation ? `
    "joi": "latest",` : ""}
    "express": "latest",
    "mongoose": "latest",
    "dotenv": "latest",
    "nodemon": "latest",
    "cors": "latest"${includeAuthentication ? `,
    "bcryptjs": "latest",
    "@faker-js/faker": "latest",
    "jsonwebtoken": "latest",
    "cookie-parser": "latest"` : ""}
  }
}
`
}
export default packageJsonTemplate;