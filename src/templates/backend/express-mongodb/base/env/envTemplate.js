const envTemplate = (includeAuthentication) => {
    return `PORT=5000
MONGO_URI=mongodb://localhost:27017/shipsprint-app
CORS_ORIGIN=http://localhost:5173
${includeAuthentication ? `ACCESS_TOKEN_SECRET=${generateRandomSecret()}
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d` : ""}`
}

function generateRandomSecret() {
    return Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

export default envTemplate;