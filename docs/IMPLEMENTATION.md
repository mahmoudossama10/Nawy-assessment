# Implementation Notes and Recent Changes

This file documents the concrete code changes made during the recent optimization work, why they were made, and where to find the related code. Use this as a developer guide when reviewing or extending the application.

## Summary of work done

1. Client-side pagination & filtering
   - File: `frontend/src/app/ApartmentsClient.tsx`
   - Moved apartment fetching and filter state from the server component to a dedicated client component.
   - Uses SWR to fetch `/api/apartments` (keyed by search/project/page/pageSize).
   - Benefits: Faster UI feedback, avoids full server-component rerenders on filter changes.

2. Global projects list endpoint
   - Files added/changed:
     - `backend/src/services/apartmentService.ts` — added `listProjects()`
     - `backend/src/controllers/apartmentController.ts` — added `listProjects` controller
     - `backend/src/routes/apartment.routes.ts` — added `GET /api/apartments/projects`
     - `frontend/src/lib/api.ts` — added `fetchProjects()` to call the endpoint
   - Reason: The project filter should list all projects in the system, not only projects on the current paginated page.

3. Persistent previous-data and scroll preservation
   - File: `frontend/src/app/ApartmentsClient.tsx`
   - Kept last successful data during SWR revalidation to prevent the grid collapsing to a loading state and causing layout/scroll jumps.
   - Captures scroll position before a filter/pagination change and restores it after data arrives.

4. Memoization & render reductions
   - Files:
     - `frontend/src/components/ApartmentGrid.tsx` — new memoized grid component with a comparator that checks `id` and `updatedAt`.
     - `frontend/src/components/ApartmentCard.tsx` — wrapped in `React.memo`, moved `Intl.NumberFormat` to module-level.
     - `frontend/src/components/SearchFilters.tsx` — controlled component, wrapped in `React.memo`.
     - `frontend/src/app/ApartmentsClient.tsx` — memoized project options and items array with `useMemo`, stable handlers with `useCallback`.
   - Reason: Reduce CPU/DOM churn and re-render cascades when state unrelated to the apartment list changes.

5. Image resilience and optimization
   - File: `frontend/src/components/SafeImage.tsx`
   - Implements retries and fallback for images. Added `sharp` to `frontend/package.json` to allow Next.js server-side image optimization in production builds.
   - Command to install `sharp`: `cd frontend && npm install sharp`

6. API docs and architecture docs
   - Files added: `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION.md`
   - These documents describe endpoints, responses, architecture decisions, and performance optimizations.

## How each change helps

- Client-side filtering/pagination: improves perceived latency because interactions don't require a server-rendered page swap.
- Persistent previous data: keeps the UI stable during refetch, reducing layout shifts and improving perceived performance.
- Memoization: avoids re-rendering dozens of cards when the projects list or other UI state changes.
- Image optimization (`sharp`): improves server-side image processing and reduces bandwidth/CPU in production.
- Global projects endpoint: ensures the project select displays all available projects and not just those currently visible.

## Where to look in the code

- Frontend
  - `frontend/src/app/ApartmentsClient.tsx` — main client-side controller for filtering/pagination.
  - `frontend/src/components/ApartmentGrid.tsx` — memoized grid used by the client.
  - `frontend/src/components/ApartmentCard.tsx` — card UI; memoized.
  - `frontend/src/components/SearchFilters.tsx` — controlled filters component.
  - `frontend/src/components/SafeImage.tsx` — resilient image wrapper.
  - `frontend/src/lib/api.ts` — client/server-aware API base URL and functions like `fetchApartments`, `fetchProjects`.

- Backend
  - `backend/src/services/apartmentService.ts` — data layer (Prisma) functions, including `listProjects()`.
  - `backend/src/controllers/apartmentController.ts` — controller functions for routes.
  - `backend/src/routes/apartment.routes.ts` — route registration.

## How to run (production-ready)

1. Ensure `sharp` is installed in `frontend` (already added to `package.json`). When building the frontend image the Docker build will install dependencies including sharp.
2. Use Docker Compose for a single command start: `docker compose up --build`.
3. For local development without Docker: run backend and frontend dev servers and ensure environment variables are set:

```powershell
cd backend
npm install
npx prisma generate
npm run dev

# in another terminal
cd frontend
npm install
npm run dev
```

## Tests & verification

- Manual checks done during development:
  - Verified backend endpoints with Postman.
  - Verified the projects endpoint returns deduplicated project names.
  - Checked frontend UI: filters operate without triggering full page navigation, project dropdown shows all projects, images retry and show fallback.