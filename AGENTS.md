# AI Agent Guide for Pixel Billboard

This project is a million-pixel billboard inspired by the Million Dollar Homepage.

## Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript, Vite
- **Backend**: Hono, Cloudflare Workers (serving static assets)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Package Manager**: pnpm
- **Dev Tools**: Vitest (Testing), oxlint (Linting), oxfmt (Formatting)
- **CI/CD**: GitHub Actions

## Project Structure

- `frontend/`: Vue.js application
- `backend/`: Hono API and D1 schema
- `AGENTS.md`: This guide

## Coding Conventions

- **Frontend**:
    - Use `<script setup lang="ts">` in Vue components.
    - Use HTML5 Canvas for the billboard rendering to handle 1M pixels efficiently.
    - Prefer functional components where possible for performance.
- **Backend**:
    - Use Hono for routing.
    - Keep endpoints lightweight.
    - Use D1 for persistence.
- **General**:
    - Follow TypeScript best practices.
    - Use `oxlint` for linting and `oxfmt` for formatting.
    - Write unit tests using `Vitest`.

## Development Commands

- `pnpm dev`: Start both frontend and backend in development mode.
- `pnpm lint`: Run oxlint across the project.
- `pnpm format`: Run oxfmt across the project.
- `pnpm test`: Run vitest for both frontend and backend.
