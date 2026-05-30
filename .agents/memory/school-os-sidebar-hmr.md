---
name: SchoolOS sidebar Fast Refresh quirk
description: Sidebar.tsx HMR invalidation warning — non-critical, safe to ignore
---

**Rule:** Editing `Sidebar.tsx` triggers a Vite HMR warning: `"rolePermissions" export is incompatible`. This causes a full page reload instead of a hot swap, but the app works correctly.

**Why:** `rolePermissions` is a non-component export (a plain object) in the same file as a React component. Vite's Fast Refresh plugin requires component files to export only React components. Moving `rolePermissions` to a separate file would fix it, but is not worth the refactor unless the file causes real problems.

**How to apply:** When you see this warning in logs after editing Sidebar.tsx, treat it as informational only. Do not add error-handling or restart the workflow.
