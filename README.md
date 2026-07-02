# Flowfull React Client

Clean TanStack Start client starter for Flowless and Pubflow. It keeps the default experience focused on auth, a simple dashboard, bilingual UI, theme switching, and deploy-friendly scripts.

## Features

- `@pubflow/core@0.5.0` and `@pubflow/react@0.5.0`.
- Public routes: `/`, `/login`, `/register`, `/forgot-password`.
- Protected routes: `/dashboard` and `/dashboard/profile`.
- English and Spanish locale files with a language toggle.
- Light, dark, and system theme support.
- Bridge/auth base path configuration for proxy or embedded deployments.
- Deno Deploy and Cloudflare Workers guidance through Nitro without replacing the normal Vite workflow.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Bun is also supported for local development:

```bash
bun install
bun run dev
```

## Browser preview (Nodepod)

When this template is opened in the Pubflow agent workspace, the in-browser preview uses **Nodepod** with `npm` and the committed **`package-lock.json`** for reproducible installs.

- First preview boot can take **2–5 minutes** while dependencies install inside the browser runtime.
- The `dev:preview` script is tuned for the workspace preview (`vite dev --host 0.0.0.0`).
- Heavy deploy/test tooling (`wrangler`, `vitest`, etc.) is not part of the default install; use `npx` when you need those checks locally.

If preview install is slow or blocked on your network, set `VITE_CODING_BROWSER_PROVIDER=webcontainer` on the console client as a fallback.

## Environment

```env
VITE_API_BASE_URL=http://localhost:8787
VITE_BRIDGE_BASE_PATH=/bridge
VITE_AUTH_BASE_PATH=/auth
VITE_BRIDGE_SECRET=

VITE_APP_NAME=Flowfull
VITE_APP_LOGO=
VITE_PRIMARY_COLOR=#2563eb
VITE_SECONDARY_COLOR=#14b8a6
VITE_ACCENT_COLOR=#f97316

VITE_DEFAULT_THEME=system
VITE_DEFAULT_LANGUAGE=en
VITE_PUBLIC_PATHS=/,/login,/register,/forgot-password
```

## Scripts

```bash
npm run dev          # local Vite dev server
npm run dev:preview  # Vite dev server for in-browser workspace preview
npm run build        # standard production build
npm run dev:deno     # local dev through Deno
npm run build:deno   # Nitro-powered build path for Deno Deploy checks
npm run build:cf     # Nitro-powered Cloudflare Worker build
npm run check:deno   # Deno deploy check
npm run check:cf     # Cloudflare Worker build check
npm run test         # Vitest (via npx)
```

Cloudflare deploy/dev commands use `npx wrangler` so Wrangler is not required in the default dependency tree.

## Deploy

Use the standard Vite output for Node/Bun hosting. For Deno Deploy, see `docs/deno-deploy.md`. For Cloudflare Workers, see `docs/cloudflare-workers.md`.

This starter intentionally does not mount demo routes, router devtools, test dashboards, or sample data screens in the default app shell.
