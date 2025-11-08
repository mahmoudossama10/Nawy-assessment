# Project Architecture and Design

This document explains the project's architecture, key design decisions, how features are implemented, and the performance optimizations applied during the recent iteration.

## High-level overview

- Frontend: Next.js App Router (React) rendering a responsive UI with Tailwind CSS. Uses client-side components for interactivity and SWR for data fetching.
- Backend: Express + Prisma (PostgreSQL) provides a small JSON API with pagination and search filters.
- Infrastructure: Docker Compose for local development (frontend, backend, db). Prisma migrations and seed are included.

## Important files and responsibilities

- `frontend/src/app/page.tsx` — Top-level page that mounts the client-side apartment list component.
- `frontend/src/app/ApartmentsClient.tsx` — Client-side component that handles data fetching (SWR), filtering, and pagination.
- `frontend/src/components/SearchFilters.tsx` — Controlled filter UI component (search input, project select) wired to the client component.
- `frontend/src/components/ApartmentGrid.tsx` — Memoized grid that renders `ApartmentCard` instances with a custom shallow comparator to avoid re-renders.
- `frontend/src/components/ApartmentCard.tsx` — Apartment display card. Uses a module-level `Intl.NumberFormat` instance to avoid recreating formatters.
- `frontend/src/components/SafeImage.tsx` — Wrapper around `next/image` that implements retry logic and a fallback UI.
- `frontend/src/lib/api.ts` — Fetch helpers that select API base URL depending on running environment (server vs client). This prevents server-side requests from trying to reach the browser host when run inside Docker.
- `backend/src/services/apartmentService.ts` — Prisma-powered service layer for listing apartments, fetching projects, creating apartments, and serializing decimals.
- `backend/src/controllers/apartmentController.ts` and `backend/src/routes/apartment.routes.ts` — Express controllers + routes exposing the API endpoints.

## Key design decisions and rationale

1. Server vs client responsibilities
   - The initial app used the server component to fetch paginated data and passed project options derived from the visible page. This caused the project dropdown to show only projects on the visible page. To improve UX and reduce unnecessary full-page reloads, we moved filtering and pagination into a client component (`ApartmentsClient`).
   - Rationale: Client-side filtering and pagination using SWR provides instant feedback, keeps navigation consistent, and avoids full server component rerenders for each filter change.

2. Data fetching and caching
   - SWR is used for lightweight caching and refetching. For project options and apartment lists we use separate keys so the projects list is fetched once and reused.
   - Rationale: SWR is simple and integrates well with Next.js. It allows a good caching strategy without introducing extra infra.

3. Stable props & memoization
   - Multiple components were wrapped with `React.memo` and arrays (project options, items) were memoized to provide stable references. `ApartmentGrid` uses a custom shallow comparator that checks length, ids, and `updatedAt` to avoid unnecessary re-renders when data is unchanged.
   - Rationale: Preventing unneeded renders reduces CPU work and DOM churn; particularly important on resource-constrained devices.

4. Keep previous data and scroll restoration
   - While SWR revalidates, the UI keeps the last successful data to avoid collapsing the grid to a loading state and causing layout jumps. We also capture and restore scroll position across filter/pagination changes.
   - Rationale: Improved perceived performance and prevents jarring UX where the page scrolls to top during refetch.

5. Image handling
   - `SafeImage` provides retry handling and a fallback for failed images. Additionally, `sharp` has been added as a dependency so Next.js can use it for server-side image optimization in production.
   - Rationale: Robust image handling avoids broken UI and improves performance via optimized image delivery in production.

6. API design
   - The backend exposes: `GET /api/apartments` (search, project, page, pageSize), `GET /api/apartments/:id`, `POST /api/apartments`, and `GET /api/apartments/projects`.
   - Rationale: These endpoints are small and focused, supporting the data needs of the UI without over-fetching.

## Performance optimizations implemented

- Client-side pagination/filtering moved to `ApartmentsClient` for faster interactive responses.
- Memoized components: `ApartmentCard`, `SearchFilters`, and `ApartmentGrid`.
- Stable handlers via `useCallback` and memoized props via `useMemo` to prevent child re-renders.
- Kept previous successful data during refetch to prevent layout jumps.
- Scroll position capture and restore to prevent jarring vertical jumps when data updates.
- Module-level `Intl.NumberFormat` instance to avoid repeated construction per render.
- Added `sharp` in `frontend/package.json` to ensure Next.js image optimization is available in production builds.

## How to run locally (summary)

See the root `README.md` for full developer setup steps. In short:

1. Install backend & frontend deps
2. Generate Prisma client and run migrations
3. Use `docker compose up --build` for an all-in-one environment


---

For API reference see `docs/API.md`.
