const dockerignoreTemplate = () => {
    return `**/node_modules
**/npm-debug.log*
.git
.gitignore

# The frontend has its own build context (frontend/Dockerfile)
frontend

# Secrets are injected at runtime via docker-compose env_file, never baked into the image
backend/.env
backend/.env.*

backend/tests
backend/vitest.config.js

Dockerfile
.dockerignore
docker-compose.yml
`
}

export default dockerignoreTemplate;
