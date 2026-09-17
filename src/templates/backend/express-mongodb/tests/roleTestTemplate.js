const roleTestTemplate = (includeValidation) => {
    return `import app from '../../src/app.js'
import supertest from 'supertest'
import { test, expect } from 'vitest'
import userModel from '../../src/models/user.model.js'

const api = supertest(app)

const signup = async (username, email, extra = {}) => {
    return api.post('/api/auth/signup').send({
        username,
        email,
        password: 'shipsprint123',
        ...extra
    })
}

const signinCookies = async (email) => {
    const response = await api.post('/api/auth/signin').send({ email, password: 'shipsprint123' })
    expect(response.status).toBe(200)
    return response.headers['set-cookie']
}

const getCsrfToken = async () => {
    const response = await api.get('/api/auth/csrf')
    const csrfCookie = response.headers['set-cookie']?.find(cookie => cookie.startsWith('csrfToken='))
    return { csrfCookie, csrfToken: csrfCookie.split(';')[0].split('=')[1] }
}

const createAdmin = async (username, email) => {
    await signup(username, email)
    await userModel.updateOne({ email }, { role: 'admin' })
    return signinCookies(email)
}

test('new users get the "user" role by default', async () => {
    const response = await signup('shipsprint.role.default', 'shipsprint.role.default@gmail.com')

    expect(response.status).toBe(201)
    expect(response.body.user.role).toBe('user')
})

test('signup cannot self-assign the admin role', async () => {
    const response = await signup('shipsprint.role.escalate', 'shipsprint.role.escalate@gmail.com', { role: 'admin' })
${includeValidation ? `
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"role" is not allowed')
` : `
    expect(response.status).toBe(201)
    expect(response.body.user.role).toBe('user')
`}
    const user = await userModel.findOne({ email: 'shipsprint.role.escalate@gmail.com' })
    expect(user?.role ?? 'user').toBe('user')
})

test('profile includes the user role', async () => {
    await signup('shipsprint.role.profile', 'shipsprint.role.profile@gmail.com')
    const cookies = await signinCookies('shipsprint.role.profile@gmail.com')

    const response = await api.get('/api/auth/profile').set('Cookie', cookies)

    expect(response.status).toBe(200)
    expect(response.body.user.role).toBe('user')
})

test('rejects admin route without authentication', async () => {
    const response = await api.get('/api/admin/users')

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
})

test('rejects admin route for a regular user', async () => {
    await signup('shipsprint.role.regular', 'shipsprint.role.regular@gmail.com')
    const cookies = await signinCookies('shipsprint.role.regular@gmail.com')

    const response = await api.get('/api/admin/users').set('Cookie', cookies)

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('You do not have permission to perform this action')
})

test('allows admin route for an admin', async () => {
    const cookies = await createAdmin('shipsprint.role.admin', 'shipsprint.role.admin@gmail.com')

    const response = await api.get('/api/admin/users').set('Cookie', cookies)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.users)).toBe(true)
    expect(response.body.users.some(user => user.email === 'shipsprint.role.admin@gmail.com')).toBe(true)
})

test('admin can change another user role, and it applies immediately', async () => {
    const adminCookies = await createAdmin('shipsprint.role.promoter', 'shipsprint.role.promoter@gmail.com')
    await signup('shipsprint.role.promoted', 'shipsprint.role.promoted@gmail.com')
    const userCookies = await signinCookies('shipsprint.role.promoted@gmail.com')
    const target = await userModel.findOne({ email: 'shipsprint.role.promoted@gmail.com' })
    const { csrfCookie, csrfToken } = await getCsrfToken()

    const response = await api
        .patch(\`/api/admin/users/\${target._id}/role\`)
        .set('Cookie', [...adminCookies, csrfCookie])
        .set('X-CSRF-Token', csrfToken)
        .send({ role: 'admin' })

    expect(response.status).toBe(200)
    expect(response.body.user.role).toBe('admin')

    const promotedResponse = await api.get('/api/admin/users').set('Cookie', userCookies)
    expect(promotedResponse.status).toBe(200)
})

test('rejects role change without csrf token', async () => {
    const adminCookies = await createAdmin('shipsprint.role.nocsrf', 'shipsprint.role.nocsrf@gmail.com')
    const target = await userModel.findOne({ email: 'shipsprint.role.nocsrf@gmail.com' })

    const response = await api
        .patch(\`/api/admin/users/\${target._id}/role\`)
        .set('Cookie', adminCookies)
        .send({ role: 'user' })

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('CSRF token missing')
})

test('rejects invalid role and self role change', async () => {
    const adminCookies = await createAdmin('shipsprint.role.self', 'shipsprint.role.self@gmail.com')
    const self = await userModel.findOne({ email: 'shipsprint.role.self@gmail.com' })
    const { csrfCookie, csrfToken } = await getCsrfToken()

    const invalidRole = await api
        .patch(\`/api/admin/users/\${self._id}/role\`)
        .set('Cookie', [...adminCookies, csrfCookie])
        .set('X-CSRF-Token', csrfToken)
        .send({ role: 'superuser' })

    expect(invalidRole.status).toBe(400)
    expect(invalidRole.body.message).toBe('Role must be one of: user, admin')

    const selfChange = await api
        .patch(\`/api/admin/users/\${self._id}/role\`)
        .set('Cookie', [...adminCookies, csrfCookie])
        .set('X-CSRF-Token', csrfToken)
        .send({ role: 'user' })

    expect(selfChange.status).toBe(400)
    expect(selfChange.body.message).toBe('You cannot change your own role')
})`
}

export default roleTestTemplate;
