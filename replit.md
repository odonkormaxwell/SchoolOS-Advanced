# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Maxibern SchoolOS Dashboard (`artifacts/school-dashboard`)
- **Type**: React + Vite web app, served at `/`
- **Purpose**: School management dashboard UI prototype
- **Stack**: React, Vite, Tailwind CSS, Lucide icons, ApexCharts
- **Data**: Fully static/dummy data — no backend, no database
- **Components**:
  - `Sidebar` — dark navy gradient sidebar with full navigation
  - `Topbar` — top header with search, school selector, notifications, user profile
  - `DashboardHeader` — greeting + date picker
  - `KpiCards` — 5 KPI metric cards (students, attendance, fees, revenue, top class)
  - `FeeCollectionChart` — ApexCharts area/line chart for fee collection
  - `AttendanceChart` — ApexCharts bar chart for weekly attendance
  - `Announcements` — announcement list panel
  - `RecentPayments` — recent payment transactions list
  - `OutstandingFeesChart` — ApexCharts donut chart for fees by class
  - `QuickActions` — 6 action buttons grid
  - `TransportStatus` — radial chart + bus status breakdown
  - `TodaySchedule` — class schedule for the day
  - `EventsCalendar` — upcoming events list

### API Server (`artifacts/api-server`)
- Express 5 server at `/api`
- Health check at `/api/healthz`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
