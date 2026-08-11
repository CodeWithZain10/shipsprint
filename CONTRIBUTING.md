# Contributing Guide

Thank you for contributing to this project. This repository is a CLI generator for creating a full-stack application with a backend and frontend scaffold. The project is actively being developed by Zain Zahid and Fiza Noor, and it is designed to help teams bootstrap consistent application structure quickly while keeping the generated code easy to customize.

## Project Scope

This repository contains:

- the CLI entry point and generator logic
- reusable backend templates for Express + MongoDB
- reusable frontend templates for React + Vite
- example playground projects used to validate generated output

When contributing, keep in mind that changes can affect either the generator logic or the output templates for both the backend and frontend.

## Code of Conduct

Please be respectful, collaborative, and professional in all interactions. We expect contributors to communicate clearly, review changes thoughtfully, and help maintain a welcoming environment for everyone.

## Ways to Contribute

You can contribute by:

- reporting bugs
- improving generator logic
- fixing template issues
- adding support for new backend or frontend features
- improving documentation and examples
- updating project examples in the playground folder

## Before You Start

Before opening a change:

1. Review the existing issues and pull requests.
2. Check whether your change is already in progress.
3. Keep changes focused and easy to review.
4. Make sure your update matches the current generator and template structure.

## Repository Layout

A quick overview of the main folders:

- `src/commands/` — CLI commands and entry points
- `src/generator/` — generation logic that writes project files
- `src/templates/backend/` — backend file templates
- `src/templates/frontend/` — frontend file templates
- `playground/` — example generated apps used for testing and reference

If you add new template files or generator behavior, update the related docs and examples as needed.

## Development Workflow

1. Fork the repository or create a feature branch.
2. Make your changes in the relevant generator or template files.
3. Validate the behavior with the project examples or templates you changed.
4. Keep your code style consistent with the surrounding project.
5. Open a pull request with a clear description of the update.

## Commit Guidelines

- Write clear and specific commit messages.
- Keep each commit focused on a single purpose.
- Prefer small, reviewable changes over large refactors.

Example:

```bash
git commit -m "Add frontend auth template support"
```

## Pull Request Guidelines

When creating a pull request:

- describe what changed and why
- mention the affected area, such as backend templates, frontend templates, or CLI behavior
- reference related issues where possible
- call out any breaking or migration concerns
- include screenshots or logs if they help explain the change

## Testing

If your change affects the generator or generated output, validate it with the relevant project flow before submitting.

Recommended checks:

- ensure generated files are created in the expected structure
- verify backend and frontend template output still matches expectations
- test the CLI prompts and project output manually where needed

## Documentation

If your contribution changes behavior, templates, generated structure, or commands, update the relevant documentation so it remains accurate and easy to follow.

## Reporting Issues

When reporting a bug or request, include:

- a clear description of the problem
- steps to reproduce
- expected behavior
- actual behavior
- environment details if relevant

## Style Tips

- follow the existing project structure and naming conventions
- keep template content consistent across generated projects
- avoid unrelated refactors in the same pull request
- write documentation that is easy for other contributors to follow

## Thank You

Your contributions help improve this generator and make it more useful for the wider developer community. Thank you for taking the time to contribute.
