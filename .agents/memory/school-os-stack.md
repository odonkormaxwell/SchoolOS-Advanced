---
name: SchoolOS stack & conventions
description: Tech stack, styling rules, and folder layout for Maxibern SchoolOS dashboard
---

**Stack:** React + Vite + TypeScript, pnpm monorepo. App at `artifacts/school-dashboard/src/`.

**Styling rule:** Inline styles everywhere — no CSS modules, no Tailwind. Match existing patterns when adding new pages.

**Icons:** lucide-react only.

**Charts:** apexcharts (via react-apexcharts).

**Context:** `useApp()` from `src/context/AppContext` gives `{ onNavigate, showToast }`.

**Responsive hook:** `useWindowSize()` from `src/hooks/useWindowSize` gives `{ isMobile, isTablet }`.

**Utilities (created this session):**
- `src/utils/csvExport.ts` — `exportToCSV(filename, rows[])` and `downloadSampleTemplate(filename, headers[])`
- `src/utils/printUtils.ts` — `printHTML(html, title)` and `printElement(elementId, title)`
- `src/components/ImportModal.tsx` — drag-drop import modal with template download

**School context:** Happy Kids Basic School · Accra, Ghana · KG1–JHS3 · GH₵ currency · Academic Year 2025/2026 · Term 2

**Why:** All future page additions must follow inline-style pattern and use these utils for consistency.
