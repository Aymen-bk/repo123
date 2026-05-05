# HumanKind-360

Full-stack ESG platform using Angular (frontend) and Spring Boot (backend).

## What it does

- Authenticates users with a mock Google login endpoint that returns a JWT.
- Imports company JSON documents into backend storage (Elasticsearch-ready API).
- Searches companies with filters (query, industry, country, score range).
- Shows company profile, comparison view, and insights dashboard.

## Project structure

```text
humankind360/
├── src/                       Angular app
├── backend/                   Spring Boot API
├── pa_instru/                 Input JSON files for import
└── docker-compose.yml         Elasticsearch runtime (if Docker installed)
```

## Prerequisites

- Node.js 18+
- npm 9+
- Java 17+
- Optional: Docker Desktop (for Elasticsearch container)

## Run the project

### 1) Frontend

From project root:

```powershell
npm install --legacy-peer-deps
npx ng serve --port 4300 --open
```

Open: `http://localhost:4300`

Notes:
- Use `npx ng serve` (not `ng serve`) to avoid global CLI issues.
- `--legacy-peer-deps` is required for current dependency compatibility.

### 2) Backend

From `backend` folder:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend runs on: `http://localhost:8081`

## Main API endpoints

- `POST /api/auth/mock-google`
- `POST /api/import/companies` (multipart form-data with `file`)
- `GET /api/companies`
- `GET /api/companies/{id}`
- `GET /api/companies/facets/industries`
- `GET /api/companies/facets/countries`

## Demo flow

1. Start backend and frontend.
2. Open app and sign in.
3. Go to Import page.
4. Upload files from `pa_instru/` (example: `company-1.json`).
5. Go to Search and verify imported company appears.

## Elasticsearch

If Docker is installed:

```powershell
docker compose up -d
```

This starts Elasticsearch on `http://localhost:9200`.
