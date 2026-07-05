# Google Sheets backend

The app's data layer (`src/data/repository.ts`) talks to a Google Sheet through
a small Apps Script Web App (`Code.gs`) instead of a hosted database - this
keeps the whole stack free to run and host on GitHub Pages.

## 1. Create the spreadsheet

Create a new Google Sheet with **three tabs**, named exactly as below, each
with a header row (row 1) with these exact column names:

### `Specifications`

```
id  category  parameter  allowedValues  min  max  unit
```

### `Documents`

```
id  code  title  type  status  version  owner  revisionDate  nextReviewDate
```

### `CheckSheets`

```
id  line  date  shift  furnaceNo  metalGrade  degassingGas  bestCastAlloy  otherAlloy  status  readings  machineReadings  corePinChecks  corePinComment  diePrep  signatures
```

The last five `CheckSheets` columns (`readings`, `machineReadings`,
`corePinChecks`, `diePrep`, `signatures`) hold **JSON text**, not a flat
value - the frontend serialises/parses these before sending or after
receiving (see `NESTED_FIELDS` in `src/data/repository.ts`). Leave them as
plain text cells in Sheets.

You can seed the sheets with the data already in `src/data/*.ts` (export
those arrays as CSV, or leave the tabs empty to start recording live).

## 2. Attach the script

1. In the Sheet, open **Extensions > Apps Script**.
2. Delete the placeholder `Code.gs` content and paste in this repo's
   `google-apps-script/Code.gs`.
3. Click **Deploy > New deployment**.
4. Type: **Web app**. Execute as: **Me**. Who has access: **Anyone**.
5. Deploy, authorize the requested permissions, and copy the Web App URL
   (ends in `/exec`).

## 3. Point the frontend at it

Set the URL as an environment variable when building:

```bash
# .env (local dev) - see .env.example
VITE_SHEETS_API_URL=https://script.google.com/macros/s/XXXXXXXX/exec
```

For the GitHub Pages deployment, add it as a repository variable
(**Settings > Secrets and variables > Actions > Variables**) named
`VITE_SHEETS_API_URL` - the deploy workflow (`.github/workflows/deploy-pages.yml`)
passes it through as a build-time env var.

If this isn't set, the app runs entirely on its bundled mock data (no
backend needed) - useful for demos or before the sheet is ready.

## Notes / limitations (POC)

- No auth on the Web App beyond "Anyone with the link can call it" - anyone
  who has the URL can read/append rows. Fine for a pilot; put real auth
  (e.g. a shared secret query param checked in `doGet`/`doPost`, or moving to
  a real backend) in front of it before wider rollout.
- `update` only supports updating an existing row matched by `id`; there is
  no delete endpoint since no UI currently needs one.
- Apps Script Web Apps don't support CORS preflight, so the client
  (`src/lib/sheetsClient.ts`) sends POST bodies as `text/plain` to keep
  requests "simple" (no preflight) and parses the JSON server-side anyway.
