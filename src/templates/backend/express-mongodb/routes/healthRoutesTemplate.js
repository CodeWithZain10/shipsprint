const healthRoutesTemplate = (answers) => {
    return `import express from 'express'
import mongoose from 'mongoose'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

const router = express.Router()

const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
}

const endpoints = [
    { method: 'GET', path: '/health', description: 'Service and database health' },
    { method: 'GET', path: '/version', description: 'Application version' },
    { method: 'GET', path: '/api-info', description: 'API metadata and available endpoints' }${answers.includeAuthentication ? `,
    { method: 'GET', path: '/api/auth/csrf', description: 'Issue a CSRF token cookie' },
    { method: 'POST', path: '/api/auth/signup', description: 'Register a new user' },
    { method: 'POST', path: '/api/auth/signin', description: 'Sign in and receive auth cookies' },
    { method: 'POST', path: '/api/auth/refresh', description: 'Rotate refresh token and issue a new access token' },
    { method: 'POST', path: '/api/auth/signout', description: 'Revoke the current session' },
    { method: 'GET', path: '/api/auth/profile', description: 'Get the authenticated user' }` : ''}${answers.includeAuthentication && answers.includeRBAC ? `,
    { method: 'GET', path: '/api/admin/users', description: 'List users (admin only)' },
    { method: 'PATCH', path: '/api/admin/users/:id/role', description: 'Change a user role (admin only)' }` : ''}
]

router.get('/health', (req, res) => {
    const database = dbStates[mongoose.connection.readyState] || 'unknown'
    const healthy = database === 'connected'

    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'degraded',
        database,
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    })
})

router.get('/version', (req, res) => {
    res.status(200).json({
        name: pkg.name,
        version: pkg.version
    })
})

router.get('/api-info', (req, res) => {
    res.status(200).json({
        name: pkg.name,
        version: pkg.version,
        environment: process.env.NODE_ENV || 'development',
        node: process.version,
        baseUrl: \`\${req.protocol}://\${req.get('host')}\`,
        endpoints
    })
})

export default router`
}

export default healthRoutesTemplate;
