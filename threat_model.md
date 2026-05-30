# Threat Model

## Project Overview

This project is a pnpm monorepo for a school management product. In production it exposes two relevant artifacts on a public Replit autoscale deployment: a static React/Vite dashboard at `/` and an Express 5 API service at `/api`. The current API implementation is minimal and only serves a health check; the dashboard is a static prototype backed by bundled dummy data rather than live API calls. A separate mockup sandbox exists at `/__mockup`, but per project assumptions and artifact configuration it is a design/development surface and should be treated as dev-only unless future deployment wiring makes it production-reachable.

## Assets

- **Future school records and operational data** — the dashboard models student, staff, finance, health, and transport workflows. If the API is expanded, these records will become high-value confidential data.
- **Application runtime secrets** — `DATABASE_URL`, future auth secrets, and any third-party API keys used by the API server or background jobs.
- **Deployment integrity** — the static dashboard content and API responses must not be modified by unauthorized parties.
- **Availability of public routes** — the `/` dashboard and `/api` service must remain resistant to trivial request-based disruption.

## Trust Boundaries

- **Browser to `/api`** — all request data crossing from the public internet into the Express server is untrusted and must be validated server-side.
- **API server to database** — `lib/db` establishes direct PostgreSQL access. Any future route using it must prevent injection and scope data access correctly.
- **Static client to future authenticated services** — the client can express roles and privileged workflows in UI state, but those role concepts are not trustworthy unless enforced server-side.
- **Production vs dev-only artifacts** — `artifacts/mockup-sandbox` is development/design-only and should usually be ignored for production vulnerability reporting unless deployment configuration changes.

## Scan Anchors

- Production entry points: `artifacts/school-dashboard/.replit-artifact/artifact.toml`, `artifacts/api-server/.replit-artifact/artifact.toml`, `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`.
- Highest-risk code areas for future scans: `artifacts/api-server/src/**`, `lib/db/src/**`, auth/token plumbing in `lib/api-client-react/src/custom-fetch.ts`.
- Public surfaces: `/` static dashboard and `/api/**` API routes. No authenticated or admin server surface exists yet.
- Usually ignore as dev-only: `artifacts/mockup-sandbox/**` and other preview-only tooling unless production routing changes.

## Threat Categories

### Spoofing

If the API later grows beyond `/api/healthz`, any endpoint exposing school data or mutating records must require a validated server-side identity. Client-side role labels in the dashboard are presentation only and must never be treated as proof of privilege.

### Tampering

All request bodies, query parameters, and headers sent to `/api` must be validated on the server before use. Future business rules for fees, attendance, payroll, admissions, and permissions must be enforced server-side rather than trusting client state or generated API callers.

### Information Disclosure

The current public dashboard bundles prototype data, and the API should avoid exposing stack traces, secrets, cookies, bearer tokens, or database errors in responses or logs. Any future endpoints that return school records must scope responses to the authorized caller and return only the fields required by the client.

### Denial of Service

The Express server must remain resilient against oversized payloads and unauthenticated abuse as new endpoints are added. Resource-intensive or externally dependent routes should use request size limits, timeouts, and, where appropriate, rate limiting.

### Elevation of Privilege

Future use of `lib/db` or additional service integrations must preserve strict server-side authorization boundaries. Role or page visibility in the React app is not a control; any privileged API route must independently verify permission, and all database access must remain parameterized through safe query builders or equivalent controls.
