# create-shipsprint

A CLI scaffold generator for creating a production-ready full-stack app with a Node.js + Express backend and a React + Vite frontend.

This project helps you skip the repetitive setup for new applications by generating an opinionated project structure with optional authentication, validation, environment configuration, and frontend pages.

## Features

- 📁 Express + MongoDB backend scaffold with standard folders such as `routes`, `controllers`, `models`, `middlewares`, `config`, and `utils`
- 🔐 Optional JWT authentication with user model, auth controller, routes, and protected middleware
- 🍃 Mongoose database setup with environment-based configuration
- 🧩 Validation and error-handling middleware templates
- ⚛️ React + Vite frontend scaffold with pages, context, protected routes, and API service layer
- 📦 Auto-generated package files for both backend and frontend
- 🔑 `.env` templates for API and database configuration
- 🩺 Built-in `GET /health`, `GET /version` and `GET /api-info` routes, shown live in the frontend
- 📝 Optional winston request logging (colorized in development, JSON in production)
- 🛡️ Optional role-based access control (`user` / `admin`) with an admin panel in the frontend
- 🐳 Optional Docker setup: `Dockerfile`, `.dockerignore` and `docker-compose.yml` (API + MongoDB, plus an nginx frontend when included)

## Installation & Usage

Run the generator from a terminal:

```bash
npx create-shipsprint
```

You will be prompted for project details such as:

- project name
- whether to include authentication
- whether to include role-based access control (only asked when authentication is enabled)
- whether to include validation
- whether to include an error handler (always included with authentication)
- whether to include request logging (winston)
- whether to include a Docker setup
- whether to include a frontend

The generator then creates a project folder with both a backend and a frontend structure.

```bash
cd your-project-name
```

Then install dependencies for each app:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

Configure your backend environment file and start the API:

```bash
cd backend
npm install
```

```bash
nodemon server.js
```

Start the frontend app separately:

```bash
cd frontend
npm run dev
```

## What Gets Generated

```text
your-project-name/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
└── README.md
```

If authentication is enabled, the generated backend includes:

- `backend/src/models/user.model.js`
- `backend/src/controllers/auth.controller.js`
- `backend/src/middlewares/auth.middleware.js`
- `backend/src/routes/auth.routes.js`

If validation is enabled, the generator also includes middleware and validation helpers.

Authentication also generates refresh-token rotation (`POST /api/auth/refresh`), CSRF protection, rate limiting, a seeder (`npm run seed`) and a Vitest + Supertest suite (`npm test`, needs a local MongoDB).

If role-based access control is enabled:

- users get a `role` field (`user` by default; signup cannot set it)
- `roleMiddleware('admin')` protects routes after `authMiddleware`
- `GET /api/admin/users` and `PATCH /api/admin/users/:id/role` are available to admins
- `npm run make-admin -- you@example.com` promotes your first admin
- the frontend adds an `/admin` page and `<ProtectedRoute allowedRoles={['admin']}>`

### Docker

If Docker setup is enabled, run everything from the project root:

```bash
docker compose up --build
```

The API is available on `http://localhost:3000` and, when a frontend is included, the app on `http://localhost:8080` (nginx proxies `/api` and the health routes to the backend). Secrets are read from `backend/.env` at runtime and are never copied into the image.

## Project Structure

The repository itself is organized around the generator templates and examples:

- `src/commands/` — CLI command entry points
- `src/generator/` — project generation logic
- `src/templates/backend/` — backend scaffold templates
- `src/templates/frontend/` — frontend scaffold templates
- `playground/` — example generated projects for backend and frontend testing

## Roadmap

- [ ] TypeScript support
- [ ] More frontend stacks and templates
- [x] Testing setup for generated apps
- [x] Docker support
- [ ] File upload and media handling

## Team

This project is being developed by:

- Zain Zahid
- Fiza Noor

## Contributing

Contributions are welcome from both team members and collaborators. Whether you are fixing a bug, improving the templates, or adding a new feature, we encourage you to read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting changes.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

MIT © Zain Zahid / Bytes Limited