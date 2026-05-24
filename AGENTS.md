# AI Agent Guide for Pixel Billboard

This project is a million-pixel billboard inspired by the Million Dollar Homepage.

## Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript, Vite, TanStack Vue Query
- **Backend**: Hono, Cloudflare Workers (serving static assets)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Package Manager**: pnpm
- **Dev Tools**: Vitest (Testing), oxlint (Linting), oxfmt (Formatting)
- **CI/CD**: GitHub Actions

## Project Structure

- `frontend/`: Vue.js application
- `backend/`: Hono API and D1 schema
- `shared/`: Shared TypeScript types and constants
- `AGENTS.md`: This guide

## Coding Conventions

- **Frontend**:
    - Use `<script setup lang="ts">` in Vue components.
    - Use HTML5 Canvas for the billboard rendering with an **offscreen canvas** for caching.
    - Implement **Zoom and Pan** for interacting with the 1M pixel board.
    - Use **TanStack Vue Query** for data fetching and state management.
    - Sanitize all user-provided links to prevent XSS.
- **Backend**:
    - Use Hono for routing and **secureHeaders** for security.
    - Use **Zod** for strict input validation of all API requests.
    - Keep endpoints lightweight.
    - Use D1 for persistence.
- **General**:
    - Follow TypeScript best practices.
    - Use `shared/` for types used by both frontend and backend.
    - Use `oxlint` for linting and `oxfmt` for formatting.
    - Write unit tests using `Vitest`.

## Development Commands

- `pnpm dev`: Start both frontend and backend in development mode.
- `pnpm lint`: Run oxlint across the project.
- `pnpm format`: Run oxfmt across the project.
- `pnpm test`: Run vitest for all packages.
