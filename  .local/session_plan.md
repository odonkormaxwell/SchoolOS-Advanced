# Objective
Assess the entire production-reachable application for real, exploitable vulnerabilities and avoid reporting dev-only or prototype-only noise.

# Relevant information
- Public deployment is enabled on `https://edulex.replit.app`.
- Production artifacts:
  - `artifacts/school-dashboard` serves static files at `/`.
  - `artifacts/api-server` serves Express routes at `/api`.
- `artifacts/mockup-sandbox` is a design/dev artifact at `/__mockup` and is out of scope unless a production-reachable path is proven.
- Current API spec and source indicate only `/api/healthz` exists.
- SAST produced one medium finding in `artifacts/mockup-sandbox/src/App.tsx`; it appears dev-only and needs no production report unless deployment evidence contradicts scope.
- HoundDog produced no findings.

# Tasks

### T001: Backend API and server configuration review
- **Blocked By**: []
- **Details**:
  - Review `artifacts/api-server/src/**`, deployment config, and `lib/db/**` for production-reachable auth, access control, injection, SSRF, secret handling, logging, and CORS issues.
  - Confirm whether any configuration smells are exploitable given the current route set.
  - Acceptance: Any real backend vulnerability is documented, or the backend is ruled low-risk with specific evidence.

### T002: Frontend and client-side production surface review
- **Blocked By**: []
- **Details**:
  - Review `artifacts/school-dashboard/**` and shared client code for XSS, token leakage, exposed secrets, unsafe dynamic code loading, or client-only authorization flaws that matter in production.
  - Explicitly treat `artifacts/mockup-sandbox/**` as dev-only unless routing proves otherwise.
  - Acceptance: Any real client-side production vulnerability is documented, or scanner/config findings are ruled out with evidence.

### T003: Findings synthesis and vulnerability state updates
- **Blocked By**: [T001, T002]
- **Details**:
  - Deduplicate confirmed issues, update any relevant existing vulnerability files, group any new findings under `.local/new_vulnerabilities/`, and finalize the scan.
  - Acceptance: Threat model is current, vulnerability directories are correct, and the scan can be proposed to the user.
