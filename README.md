# HumanKind 360 — ESG Analytics Platform

A full-stack web application for exploring, comparing, and importing company **ESG** (Environmental, Social, Governance) ratings. Built for analysts and sustainability teams who need transparent scores, drill-down metrics, and portfolio-level insights.

---

## What it does

| Need | Feature |
|------|---------|
| Find companies by name, sector, or score | **Search** with filters and full-text lookup |
| Understand how a score is built | **Company profile** — 3-level metric tree with explanations and sources |
| Benchmark peers | **Compare** up to 4 companies side-by-side (L1 → L3) |
| Sector overview and trends | **Insights** dashboard — KPIs, histograms, benchmarks, charts |
| Add new data | **Import** JSON files or **manual entry** with auto-scoring |

**Demo companies (seeded on startup):** Apple Inc. (AAPL, score 82.48) and COVER 50 (COV.MI, score 86.33).

---

## Scoring model (Humankind V2)

Scores roll up from granular indicators to a single global ESG score:

```
L3 metrics (individual indicators, 0–100)
        ↓ arithmetic mean
L2 sub-criteria (e.g. "Gender Diversity", "GHG Reduction")
        ↓ arithmetic mean
L1 categories: Governance | People | Planet
        ↓ equal weight (⅓ each)
Global ESG Score (0–100)
```

Pre-scored JSON imports are preserved; the backend only computes scores when `global_score` is missing or zero.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 17 (standalone components), Tailwind CSS, Chart.js |
| Backend | Spring Boot 3.3, Java 17 |
| Search & storage | Elasticsearch 8.13 (with in-memory fallback if ES is down) |
| Auth | JWT — passwordless email OTP + Google OAuth 2.0 |
| Deploy | Single JAR — Angular built into `backend/src/main/resources/static` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Angular SPA (lazy routes, JWT interceptor)             │
│  Search · Profile · Compare · Insights · Import · Auth  │
└──────────────────────────┬──────────────────────────────┘
                           │ REST /api/**
┌──────────────────────────▼──────────────────────────────┐
│  Spring Boot (port 8081)                                │
│  Controllers → ScoringEngine → CompanyEsService         │
│  Auth (OTP, Google OAuth) · JWT filter · DataSeeder     │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     Elasticsearch :9200        In-memory fallback
     (index: companies)         (if ES unreachable)
```

### Main API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/otp/request` | Send 6-digit OTP to email |
| `POST` | `/api/auth/otp/verify` | Verify OTP → JWT |
| `GET` | `/api/auth/oauth2/authorize/google` | Google login redirect URL |
| `GET` | `/api/companies` | Search (`q`, `industry`, `country`, score range) |
| `GET` | `/api/companies/{id}` | Full company document |
| `POST` | `/api/companies` | Create / upsert company |
| `GET` | `/api/compare?ids=...` | Batch fetch for comparison |
| `POST` | `/api/import/companies` | Import JSON (body or file) |
| `GET` | `/api/trends/multi?ids=...` | Score history for charts |

All `/api/**` routes except auth require a `Bearer` JWT.

---

## Project structure

```
humankind360/
├── src/                    # Angular 17 frontend
│   └── app/
│       ├── features/       # auth, search, company-profile, compare, insights, import
│       ├── core/           # services, guards, models, interceptors
│       └── shared/         # nav, score-badge, score-bar
├── backend/                # Spring Boot API
│   └── src/main/java/com/humankind360/backend/
│       ├── web/            # REST controllers
│       ├── auth/           # OTP, Google OAuth, email
│       ├── es/             # Elasticsearch client
│       ├── scoring/        # Score rollup engine
│       └── config/         # Security, CORS, data seeding
├── pa_instru/              # Seed JSON (loaded on startup)
│   ├── company-1.json      # Apple Inc.
│   └── company-2.json      # COVER 50
└── docker-compose.yml      # Elasticsearch
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Java** 17
- **Docker** (for Elasticsearch)
- **Google Cloud Console** — OAuth 2.0 Client ID (for Google login)
- **ngrok** (free account) — public HTTPS URL for OAuth in development
- **Gmail App Password** (optional) — real OTP emails; otherwise OTP prints in the backend console

---

## Quick start

### 1. Start Elasticsearch

```bash
docker compose up -d
```

Wait until ES is healthy on `http://localhost:9200`.

### 2. Build the frontend into the backend

From the project root:

```bash
npm install
npx ng build --output-path=backend/src/main/resources/static
```

Re-run this after any UI changes.

### 3. Start ngrok (for Google OAuth)

```bash
ngrok http 8081
```

Copy the **Forwarding** URL (e.g. `https://xxxx.ngrok-free.dev`).

### 4. Configure Google OAuth

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

- **Authorized JavaScript origins:** `YOUR_NGROK_URL`
- **Authorized redirect URIs:** `YOUR_NGROK_URL/api/auth/oauth2/callback/google`

### 5. Start the backend

```bash
cd backend

NGROK_URL="https://YOUR-NGROK-URL.ngrok-free.dev"

# Optional: real emails (omit to print OTP in console)
EMAIL="your-email@gmail.com"
APP_PASS="your-16-char-app-password"

MAIL_USERNAME="$EMAIL" \
MAIL_PASSWORD="$APP_PASS" \
GOOGLE_REDIRECT_URI="$NGROK_URL/api/auth/oauth2/callback/google" \
FRONTEND_URL="$NGROK_URL" \
APP_CORS_ALLOWED_ORIGINS="$NGROK_URL" \
./mvnw spring-boot:run
```

### 6. Open the app

Browse to **your ngrok URL**.

- **OTP login:** Enter email → check backend console for `╔══ OTP ══╗` → paste the 6-digit code.
- **Google login:** Click "Continue with Google" (uses the redirect URI above).

---

## Local development (frontend only)

Terminal 1 — backend on port 8081 (with ES running):

```bash
cd backend && ./mvnw spring-boot:run
```

Terminal 2 — Angular dev server on port 4200:

```bash
npm start
```

Open `http://localhost:4200`. CORS is preconfigured for `localhost:4200`.

---

## Usage walkthrough

1. **Login** — OTP or Google OAuth.
2. **Search** — Filter by industry, country, score; add companies to the compare basket (max 4).
3. **Company profile** — Radar chart, expand L1 → L2 → L3 metrics, read explanations, export CSV.
4. **Compare** — Side-by-side L1 overview, L2 gaps, L3 details, bar chart.
5. **Insights** — Portfolio KPIs, score distribution, sector benchmarks, trend lines.
6. **Import** — Upload Humankind V2 JSON or use the manual entry form.

---

## Authentication

| Method | Flow |
|--------|------|
| **Email OTP** | Request code → verify → JWT stored in `localStorage` (240 min) |
| **Google OAuth** | Redirect to Google → callback → JWT in URL → `/auth/callback` |

Protected routes use `AuthGuard`; API calls attach `Authorization: Bearer <token>` via an HTTP interceptor.

---

## Data model (summary)

Each company document includes:

- **Identity:** `company_id`, `company_name`, `company_ticker`, `country`, `industry`
- **Scores:** `humankind_response.global_score`, `category_details[]`
- **Hierarchy:** L1 (Governance / People / Planet) → L2 sub-criteria → L3 metrics
- **Transparency:** per-metric `score`, `sources[]`, explanations (EN/FR), `information[]`

Seed files in `pa_instru/` follow the full Humankind V2 output format.

---

## Tests

Backend unit tests (JUnit 5):

```bash
cd backend && ./mvnw test
```

Covers: `ScoringEngine`, `AuthController`, `CompareController`, `TrendsController`, `CompanyEsService`.

---

## Known limitations

- OTP codes and compare selection are **in-memory** (lost on server restart).
- Trend charts use **synthetic** quarterly history unless `score_history` exists in the JSON.
- API base URL is hardcoded to `http://localhost:8081/api` in frontend services.
- Only 2 companies are seeded by default; scale requires more imports.
- PDF export uses browser print; Excel export is CSV.

---

Boubrik Aymen
Chahti Moad
