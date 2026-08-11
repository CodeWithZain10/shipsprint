# create-backend-scaffold

A CLI tool to scaffold a production-ready MERN (Express + MongoDB) backend structure in seconds — with optional JWT authentication built in.

Stop rewriting the same folder structure, auth boilerplate, and config setup for every new project. Scaffold it once, in one command.

## Features

- 📁 Standard, opinionated backend folder structure (`routes`, `controllers`, `models`, `middlewares`, `config`, `utils`)
- 🔐 Optional JWT authentication (register, login, logout, protected-route middleware) powered by `bcryptjs` and `jsonwebtoken`
- 🍃 MongoDB connection setup via Mongoose, pre-wired and ready to use
- ⚡ Express + CORS configured out of the box
- 📦 Auto-generated `package.json` with only the dependencies you actually need
- 🔑 `.env` template generated for you, with placeholders for the values you need to fill in

## Installation & Usage

No installation needed — just run:

```bash
npx create-backend-scaffold
```

You'll be asked a few quick questions (project name, whether you want authentication, etc.), and your backend will be scaffolded in a new folder.

Then:

```bash
cd your-project-name
npm install
```

Fill in your `.env` file with your MongoDB connection string (and JWT secret, if you included authentication), then:

```bash
nodemon server.js
```

That's it — your backend is running.

## What Gets Generated

```
your-project-name/
├── server.js
├── package.json
├── .env
└── src/
    ├── app.js
    ├── routes/
    ├── controllers/
    ├── models/
    ├── middlewares/
    ├── config/
    │   └── db.js
    └── utils/
```

If you choose authentication during setup, you'll additionally get:

- `src/models/user.model.js` — a User schema with password hashing built in
- `src/controllers/auth.controller.js` — register, login, and logout logic
- `src/middlewares/auth.middleware.js` — JWT verification middleware for protected routes
- `src/routes/auth.routes.js` — auth endpoints, wired into `app.js`

## Roadmap

- [ ] Validation library support (Joi / express-validator)
- [ ] TypeScript option
- [ ] File upload setup (multer + cloud storage)
- [ ] Docker setup
- [ ] Testing setup (Jest)

## Contributing

Contributions are very welcome! Whether it's a bug fix, a new feature, or an improvement to the docs — check out [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

## License

MIT © [Zain Zahid / Bytes Limited] -- see [LICENSE](./LICENSE) for details.