const dockerComposeTemplate = (answers) => {
    const dbName = (answers.projectName || 'shipsprint-app').toLowerCase().replace(/[^a-z0-9_-]/g, '-')

    return `services:
  mongo:
    image: mongo:8
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - ./backend/.env
    environment:
      NODE_ENV: production
      PORT: 3000
      MONGO_URI: mongodb://mongo:27017/${dbName}${answers.includeFrontend ? `
      CORS_ORIGIN: http://localhost:8080
      # nginx in the frontend container forwards client IPs (used by rate limiting)
      TRUST_PROXY: "true"` : ""}
    ports:
      - "3000:3000"
    depends_on:
      mongo:
        condition: service_healthy
${answers.includeFrontend ? `
  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: /api
    restart: unless-stopped
    ports:
      - "8080:80"
    depends_on:
      backend:
        condition: service_healthy
` : ""}${answers.includeAuthentication ? `
# NOTE: NODE_ENV=production marks auth cookies as Secure. Browsers accept Secure cookies
# on http://localhost, but any other host must be served over HTTPS.
` : ""}
volumes:
  mongo-data:
`
}

export default dockerComposeTemplate;
