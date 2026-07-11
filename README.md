# EventCloud Frontend

React + Vite frontend for the event management platform (Event, Program, and
Registration microservices). Built with MUI for components and React Router
for navigation.

## Requirements

Node 20+ (a `.nvmrc` is included — run `nvm use`).

## Setup

```bash
npm install
cp .env.example .env   # adjust API base URL / paths for your environment
npm run dev
```

## Configuration

The app talks to the backend through a single configurable base URL plus
per-service path prefixes (see `.env.example`), matching an Ingress that
routes `/api/events`, `/api/program`, `/api/register`, `/api/registrations`,
and `/api/analytics` to the Event, Program, and Registration services.

- `VITE_API_BASE_URL` — leave empty for same-origin requests (recommended for
  production, since the frontend and API sit behind the same Ingress/Load
  Balancer). Set to `http://localhost:8080` or similar for local development
  against a standalone backend.
- `VITE_EVENTS_PATH`, `VITE_PROGRAM_PATH`, `VITE_REGISTER_PATH`,
  `VITE_REGISTRATIONS_PATH`, `VITE_ANALYTICS_PATH` — override if your Ingress
  uses different prefixes.

**Note on analytics and CORS:** the analytics client uses
`navigator.sendBeacon`, which always sends credentialed requests. If the
analytics endpoint is ever called cross-origin, its CORS response must set a
specific `Access-Control-Allow-Origin` (not `*`). Serving the frontend and API
from the same origin behind the Ingress avoids this entirely.

## Structure

- `src/api/` — HTTP client and per-service API calls (events, program,
  registrations, analytics)
- `src/components/` — shared UI (nav bar, event card, registration form,
  loading/error states)
- `src/pages/` — routed pages (Events list, Event detail + registration,
  Program schedule, Registrations list)
- `src/hooks/usePageAnalytics.js` — tracks page views, scroll depth, and time
  on page for every route change

## Analytics events sent

`page_viewed`, `scroll_depth`, `time_on_page`, `button_click`,
`registration_attempt` — each includes a session ID, page path, and
timestamp, ready to be ingested by the backend into ClickHouse.

## Build

```bash
npm run build   # outputs static assets to dist/, served by Nginx in Kubernetes
npm run preview
```
