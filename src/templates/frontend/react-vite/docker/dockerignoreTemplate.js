const reactDockerignoreTemplate = () => {
    return `node_modules
dist
npm-debug.log*
.env
.env.*
.git
Dockerfile
.dockerignore
`
}

export default reactDockerignoreTemplate;
