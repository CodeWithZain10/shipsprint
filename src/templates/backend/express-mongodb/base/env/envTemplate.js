const envTemplate = (includeAuthentication) => {
    return `MONGO_URI=your_mongodb_connection_string_here
${includeAuthentication ? "JWT_SECRET=your_jwt_secret_key" : ""}`
}

export default envTemplate