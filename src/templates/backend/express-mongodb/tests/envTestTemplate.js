const envTestTemplate = () => {
    return `MONGO_URI=mongodb://localhost:27017/shipsprint-test
ACCESS_TOKEN_EXPIRES_IN=15m
ACCESS_TOKEN_SECRET=sdsgfesryeydglkdjgoetu45906yubiodnfghoktsdjyhroigh5w463757yghjdkbkj
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=test
CORS_ORIGIN=http://localhost:5173
ENABLE_RATE_LIMIT=false`
}

export default envTestTemplate;
