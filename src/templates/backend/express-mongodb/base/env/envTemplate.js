const envTemplate = (includeAuthentication, projectName, includeEmail) => {
    return `PORT=3000
MONGO_URI=mongodb://localhost:27017/${projectName || 'my-app'}
CORS_ORIGIN=http://localhost:5173
${includeAuthentication ? `ACCESS_TOKEN_SECRET=${generateRandomSecret()}
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d` : ""}${includeEmail ? `

# Email (nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com` : ""}`
}

function generateRandomSecret() {
    return Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

export default envTemplate;