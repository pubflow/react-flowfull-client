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
bun install
cp .env.example .env.local
bun run dev
```

Open `http://localhost:3000`.

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
bun run dev          # local Vite dev server
bun run build        # standard production build
bun run dev:deno     # local dev through Deno
bun run build:deno   # Nitro-powered build path for Deno Deploy checks
bun run build:cf     # Nitro-powered Cloudflare Worker build
bun run check:deno   # Deno deploy check
bun run check:cf     # Cloudflare Worker build check
bun run test         # Vitest
```

## Deploy

Use the standard Vite output for Node/Bun hosting. For Deno Deploy, see `docs/deno-deploy.md`. For Cloudflare Workers, see `docs/cloudflare-workers.md`.

This starter intentionally does not mount demo routes, router devtools, test dashboards, or sample data screens in the default app shell.
