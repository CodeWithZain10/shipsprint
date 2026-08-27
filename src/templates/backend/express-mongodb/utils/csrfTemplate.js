const csrfTemplate = () => {
    return `import crypto from 'node:crypto'

export const generateCsrfToken = () => {
    return crypto.randomBytes(16).toString('base64url')
}`
}

export default csrfTemplate;
