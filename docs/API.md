# API Documentation

This document describes the backend API endpoints, request parameters, and response shapes.

Base URL

- Local development (frontend talking to backend from browser): `http://localhost:4000`
- When running in Docker, the backend container is reachable at `http://backend:4000` from other containers. The frontend chooses between `NEXT_PUBLIC_API_BASE_URL` (client) and `API_BASE_URL` (server) depending on runtime.


## GET /api/apartments

List apartments with optional search and pagination.

Query parameters

- `search` (string, optional): substring search across `name`, `unitNumber`, and `project`.
- `project` (string, optional): filter apartments by project name (case-insensitive, substring match).
- `page` (integer, optional): page number (1-indexed). Default: `1`.
- `pageSize` (integer, optional): number of items per page. Default: `9`.

Response (200)

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Sunset View Apartment",
      "unitNumber": "A-1205",
      "project": "Sunset Residences",
      "bedrooms": 3,
      "bathrooms": 2,
      "price": 225000,
      "area": 140,
      "address": "1205 Palm Street",
      "city": "Cairo",
      "country": "Egypt",
      "description": "...",
      "images": ["https://..."],
      "amenities": ["Pool Access"],
      "createdAt": "2025-11-07T...Z",
      "updatedAt": "2025-11-07T...Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 9,
    "total": 21,
    "totalPages": 3
  }
}
```

Errors

- `400` — Invalid query parameters (validated by Zod on the backend).

Example curl

```bash
curl "http://localhost:4000/api/apartments?search=Sunset&page=1&pageSize=9"
```


## GET /api/apartments/:id

Get a single apartment by `id`.

Response (200)
- Returns an `Apartment` object as above.

Errors

- `404` — Apartment not found.

Example curl

```bash
curl "http://localhost:4000/api/apartments/REPLACE_WITH_ID"
```


## POST /api/apartments

Create a new apartment. Body must comply with the create schema (see backend `validators/apartmentValidators.ts`).

Example body

```json
{
  "name": "New Apartment",
  "unitNumber": "D-101",
  "project": "New Project",
  "bedrooms": 2,
  "bathrooms": 2,
  "price": 150000,
  "area": 85,
  "address": "1 Example Street",
  "city": "Cairo",
  "country": "Egypt",
  "description": "...",
  "images": [],
  "amenities": []
}
```

Response (201)
- Returns the created apartment object.

Errors

- `400` — Validation failed.


## GET /api/apartments/projects

Returns a deduplicated, sorted list of project names (strings).

Response (200)

```json
["Green Meadows", "Nile Towers", "Sunset Residences"]
```

Errors

- `500` — Server error.


## Notes & Best Practices


You can also find a machine-readable OpenAPI (Swagger) spec at `docs/openapi.yaml` for use with Swagger UI or other tooling.
---

For architecture and implementation notes see `docs/ARCHITECTURE.md`.
