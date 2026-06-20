# Cloudflare Workers

This starter uses TanStack Start with Nitro. The Cloudflare path is additive: it does not replace the normal Vite/Bun workflow.

## Commands

```bash
bun install
bun run build:cf
bun run dev:cf
bun run deploy:cf
```

`build:cf` writes a Worker bundle and a generated `.output/server/wrangler.json`. The preview and deploy commands use that generated config so the runtime entry, static assets, compatibility date, and `nodejs_compat` flag stay aligned with the Nitro build.

## Environment

Set the same public `VITE_*` values from `.env.example` in Cloudflare. Anything prefixed with `VITE_` is browser-visible, so do not put private server secrets there unless the app is intentionally trusted.
