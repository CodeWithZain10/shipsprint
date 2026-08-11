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

## Installation & Usage

Run the generator from a terminal:

```bash
npx create-shipsprint
```

You will be prompted for project details such as:

- project name
- whether to include authentication
- whether to include validation
- whether to include an error handler

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
- [ ] Testing setup for generated apps
- [ ] Docker support
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