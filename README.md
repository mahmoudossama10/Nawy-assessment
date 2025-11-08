# Nawy Apartments

A full-stack apartment listing platform built with a TypeScript/Node.js backend, a Next.js frontend, and PostgreSQL for data storage. The application supports browsing, searching, and viewing detailed apartment information with a responsive user experience.

## Features

- **API-first backend** with Express, Prisma ORM, and PostgreSQL
  - List apartments with pagination and search filters (name, unit number, project)
  - Retrieve rich apartment details (amenities, imagery, pricing)
  - Add new apartments with schema validation powered by Zod
- **Responsive Next.js frontend** with Tailwind CSS
  - Dynamic search interface with instant filter feedback
  - Card-based grid optimized for mobile and desktop
  - Detail pages featuring highlights, amenities, and CTA
- **Infrastructure ready**
  - Docker Compose spins up the frontend, backend, and database with a single command
  - Prisma migrations and seed data for reproducible environments

## Tech Stack

- **Backend:** Node.js, Express, Prisma, Zod
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Database:** PostgreSQL
- **Tooling:** TypeScript, ESLint, Prettier, Docker

## Getting Started (Local Development)

### Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop for containerized setup

### 1. Clone the repository

```bash
git clone https://github.com/mahmoudossama10/Nawy-assessment
cd apartment-app
```

### 2. Install dependencies

```bash
cd backend && npm install
npx prisma generate
cd ../frontend && npm install
```

### 3. Provision the database

Ensure a PostgreSQL instance is running and update the environment files as needed.

```bash
# Example using local Postgres
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Apply schema and seed data
cd backend
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

### 4. Run the apps

Start the backend API:

```bash
cd backend
npm run dev
```

Start the frontend (in a separate terminal):

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to explore the UI. The backend listens on `http://localhost:4000`.

## Dockerized Setup

> **Note:** Docker Desktop must be running. If Docker is unavailable, follow the local setup above.

From the project root, run a single command to start everything:

```bash
docker compose up --build
```

This single command will:
1. Build and start PostgreSQL database
2. Build backend, run migrations, seed the database with sample apartments, and start the API server
3. Build frontend and start the Next.js server

Services:

- `frontend` → http://localhost:3000
- `backend` → http://localhost:4000
- `db` → accessible on port 5432 (credentials in `docker-compose.yml`)

The backend container automatically runs Prisma migrations and seeds sample data (20+ apartments across multiple projects) on startup. No additional commands needed!

## Documentation

Additional project documentation is available in the `docs/` directory:

- `docs/ARCHITECTURE.md` — Architecture, design decisions, and performance optimizations implemented.
- `docs/API.md` — API reference for the backend endpoints (parameters, responses, examples).

## Testing & Quality

- `backend`: `npm run lint`
- `frontend`: `npm run lint`

## Project Structure

```
apartment-app/
├── backend/             # Express API (TypeScript)
│   ├── prisma/          # Prisma schema, migrations, seed
│   └── src/             # Application source code
├── frontend/            # Next.js application (App Router)
│   └── src/             # App routes, components, lib utilities
└── docker-compose.yml   # Containers for frontend, backend, and PostgreSQL
```