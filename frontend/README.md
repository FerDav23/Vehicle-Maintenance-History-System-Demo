# Historial Mantenimiento CIM — Frontend (Demo)

Frontend for the **Maintenance History** application for CIM. It lets you query and filter vehicle maintenance history by plate, date range, code, and description.

**This project is configured as a demo.** It does **not** connect to real production or staging backends. When `VITE_DEMO_MODE=true` (default), all data is mocked locally and no external API calls are made.

## Tech Stack

- **React** 19
- **Vite** 6
- **React Router** 7
- **Axios** (HTTP client with auth interceptors)

## Requirements

- **Node.js** 18+ (20+ recommended)
- **npm** 9+

## Installation

```bash
npm install
```

## Environment Variables

Copy the example file and adjust for your environment:

```bash
cp .env.example .env
```

| Variable          | Description                                                                 | Example   |
|-------------------|------------------------------------------------------------------------------|-----------|
| `VITE_DEMO_MODE`  | When `true`, use mock data only (no backend). Default for this demo repo.   | `true`    |
| `VITE_API_URL`    | API base URL (only used when `VITE_DEMO_MODE` is `false`)                    | `/api` or `https://demo-backend.example.com` |

## Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Development server (HMR)        |
| `npm run build`  | Production build               |
| `npm run preview`| Preview production build       |
| `npm run lint`   | Run ESLint                     |

## Development

```bash
npm run dev
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Routes and auth state
│   ├── main.jsx             # Entry, ErrorBoundary, BrowserRouter, initColors
│   ├── base.css             # Base styles
│   ├── variables.css        # CSS variables
│   ├── config/
│   │   ├── colors.js        # Design tokens and palette
│   │   └── init-colors.js   # Injects colors as CSS variables
│   ├── components/
│   │   ├── Login.jsx        # Login (username/password)
│   │   ├── QrBridge.jsx    # QR login (URL query params)
│   │   ├── Dashboard.jsx   # Filters (plate, dates, code, description)
│   │   ├── InfoTable.jsx   # History table (desktop)
│   │   ├── InfoTableMobile.jsx  # Mobile history view
│   │   ├── TableStates.jsx # Loading and empty states
│   │   ├── ReportForm.jsx  # PDF report form
│   │   ├── PdfViewer.jsx   # PDF viewer
│   │   └── ErrorBoundary.jsx
│   └── services/
│       ├── apiClient.jsx    # Axios + Bearer token + 401/403 redirect
│       └── user.jsx        # login, logout, fetchPlacas, getHistorialData
├── index.html
├── vite.config.js
└── package.json
```

## Features

- **Authentication**
  - Username/password login; JWT stored in `localStorage` with 24h expiration.
  - `/qr-login` route: automatic login from QR code using `userName` and `rucCi` in the query string.
  - On 401/403 the client clears the token and redirects to `/login`.

- **Dashboard**
  - **Plate** selector (list loaded from the API per user).
  - Filters: **start date**, **end date**, **code**, **description** (code and description filter client-side on loaded history).
  - History table: date, order, km, advisor, type, quantity, code, maintenance description.
  - Mobile layout (≤768px) via `InfoTableMobile`.

- **Theming**
  - Colors and tokens in `src/config/colors.js`; `init-colors.js` exposes them as CSS variables for consistent styling.

## Production Build

```bash
npm run build
```

Output goes to `dist/`. To preview the build locally:

```bash
npm run preview
```

