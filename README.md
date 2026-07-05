# Best Cast e-QMS

A web-based Quality Management System for **Best Cast IT Limited** ([bestcastgroup.com](https://bestcastgroup.com/)) covering:

- **QMS Documents** - quality manual, SOPs, work instructions and controlled formats
- **Production Line Docs** - master specifications & tolerances for the die-casting process
- **Production Line Records** - digital shift-wise process check sheets (QC FMT 038)

This is a **proof-of-concept** built from two source spreadsheets supplied for the pilot:
`Tolerances_updated_.xlsx` (process specification/tolerance master) and
`Master_Cpy_Process_Check_sheet.xlsx_Update.xlsx` (the Mando Model Line shift check sheet,
QC FMT 038 Rev.10). Their contents were digitised into `src/data/specifications.ts` and
`src/data/checkSheets.ts` / `src/types/domain.ts`.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v3, `@tanstack/react-table`, `recharts`,
`lucide-react`, `clsx`, `react-router-dom` - per [`docs/DESIGN_DEFAULTS.md`](./docs/DESIGN_DEFAULTS.md),
the design-system spec this app was built against. **Keep that file (and this README) up to
date as the app evolves** - `docs/DESIGN_DEFAULTS.md` is the source of truth for tokens,
components and conventions; every module should reuse its primitives rather than introducing
new colors/spacing/components ad hoc.

**Hosting & backend:** this is a static site (no server of its own) - it deploys to
**GitHub Pages** and persists data to a **Google Sheet** through a small Google Apps Script
Web App acting as a JSON API. See [Hosting on GitHub Pages](#hosting-on-github-pages) and
[Google Sheets backend](#google-sheets-backend) below.

## Branding note

`bestcastgroup.com` could not be reached from the build environment (network egress policy
blocked the host), so the real logo and brand colors could not be extracted automatically.
The app ships with:

- An industrial teal/graphite placeholder palette (`clinical-light` / `clinical-dark` themes
  in `src/styles/themes.css`), plus 4 alternate themes (ocean, midnight, emerald, high-contrast).
- A text-based "BEST CAST" wordmark (`src/components/layout/Logo.tsx`).

Every color in the app is a semantic CSS-variable token (`bg-primary`, `text-muted`, ...), so
swapping in the real brand palette is a one-file edit to `src/styles/themes.css`, and swapping
the logo is a one-file edit to `Logo.tsx` - no other component needs to change.

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, bumps the build ID, and produces dist/
npm run preview   # serve the production build locally
```

Copy `.env.example` to `.env` and set `VITE_SHEETS_API_URL` to point at a real backend
(see below); without it, the app runs on its bundled mock data.

## Hosting on GitHub Pages

The app is built as a static site and deploys via
[`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml), which builds
with Vite and publishes `dist/` to GitHub Pages on every push to `main` (or manually via
"Run workflow"). One-time repo setup: **Settings > Pages > Source: GitHub Actions**.

Two things make this work without a server:

- **Relative asset base** (`base: './'` in `vite.config.ts`) so the build works from a project
  page path (`https://<user>.github.io/<repo>/`) without hardcoding the repo name.
- **`HashRouter`** (not `BrowserRouter`) in `src/App.tsx` - GitHub Pages has no server-side
  rewrite rule to send deep links like `/documents` back to `index.html`, so routes live after
  a `#` (`/#/documents`) which always resolves to the single static `index.html`. A hard
  refresh on any page keeps working because of this.

To let the deployed build reach your Google Sheet, add a repository **variable** (not secret -
it's a public-facing URL) named `VITE_SHEETS_API_URL` under
**Settings > Secrets and variables > Actions > Variables**; the workflow passes it through as
a build-time env var.

## Google Sheets backend

There's no database - `src/data/repository.ts` reads/writes a Google Sheet through a Google
Apps Script Web App that exposes it as a small JSON API (`google-apps-script/Code.gs`).
Full setup steps (sheet schema per tab, deploying the script, wiring the URL) are in
[`google-apps-script/README.md`](./google-apps-script/README.md).

If `VITE_SHEETS_API_URL` isn't set, every loader in `repository.ts` falls back to the bundled
mock arrays in `src/data/*.ts`, and it also falls back automatically if a configured Sheets
API call fails - so a broken or unset backend degrades to the demo data instead of breaking
the page.

## Responsive design

The layout is designed mobile-first and verified at mobile (390px), tablet (834px) and
desktop (1440px) widths:

- **Mobile**: sidebar becomes an off-canvas drawer opened via a hamburger button in the topbar;
  KPI/chart/table grids collapse to a single column; tables scroll horizontally inside their
  own container.
- **Tablet**: KPI cards wrap to 2 columns, chart cards to 1-2 columns.
- **Desktop**: full collapsible sidebar (icon-only or full width), 4-column KPI row,
  2-column chart grid.

## Build ID / footer

Every production build increments a numeric build ID via `scripts/generate-build-info.cjs`,
wired in as an npm `prebuild` hook. It reads/writes `src/build-info.json`
(`{ buildId, buildDate }`), which the footer (`src/components/layout/Footer.tsx`) and the
Settings page display alongside the copyright line. Running `npm run dev` does **not**
bump the counter - only `npm run build` does, so the number reflects real production builds.

In GitHub Actions (the Pages deploy workflow), the build ID is `GITHUB_RUN_NUMBER` instead -
it increments forever across pushes with no need to commit the counter file back to the repo.
Locally, it increments the `buildId` already committed in `src/build-info.json`.

## Project structure

```
src/
  components/
    ui/          Button, Card, FormField, StatusChip, KpiCard, ChartCard, DataTable, Drawer
    layout/      Sidebar, Topbar, Footer, ThemeMenu, UserChip, Logo, AppLayout, nav.ts
    checksheet/  CheckSheetForm + empty-record factory (shared by "new" and "view" drawers)
  context/       ThemeContext (6 palettes, persisted to localStorage)
  data/          repository.ts (Sheets-or-mock data layer) + mock arrays + dropdown options
  lib/           sheetsClient.ts (Apps Script fetch wrapper), useAsyncData, cn, id, tones
  types/         Domain types (Specification, QmsDocument, CheckSheetRecord, ...)
  pages/         Dashboard, Documents, Specifications, CheckSheets, Settings
  styles/        themes.css (token definitions per theme)
docs/
  DESIGN_DEFAULTS.md   The design-system spec this app implements
google-apps-script/
  Code.gs, README.md  The Google Sheets backend + its setup guide
scripts/
  generate-build-info.cjs
.github/workflows/
  deploy-pages.yml    Builds and publishes dist/ to GitHub Pages
```

## Data & scope notes (POC)

- Every module is built against typed domain models (`src/types/domain.ts`) and reads/writes
  through `src/data/repository.ts`, so the UI is the same whether it's talking to the live
  Google Sheet or running on bundled mock data.
- No authentication - the topbar shows a static demo user, and the Apps Script Web App is
  reachable by anyone with its URL (see the limitations note in
  `google-apps-script/README.md`).
- The Process Check Sheet form models the original spreadsheet's shift readings, per-machine
  readings, 10-cavity core-pin verification, die-prep start-up checks and sign-off section as
  repeatable rows/fields rather than the fixed 48-half-hour-column grid in the original Excel,
  so shifts of any length can be recorded without a fixed column count.

## Next steps for production

- Add real authentication and lock down the Apps Script endpoint (shared-secret param or a
  proper backend) before wider rollout - see the limitations note in
  `google-apps-script/README.md`.
- Replace the placeholder theme/logo with Best Cast's real brand assets once available.
- Add non-conformance/CAPA tracking and per-spec tolerance validation on check sheet entry.
- Add an audit trail / e-signature compliance layer for QMS records if regulatory sign-off
  requires it.
