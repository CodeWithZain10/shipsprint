const packageJsonTemplate = (answers) => {
    return `{
  "name": "${answers.projectName || 'shipsprint-backend'}",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "seed": "node src/utils/seeders/user.seeder.js"
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
    "mongoose": "^9.8.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}`
}

export default packageJsonTemplate;