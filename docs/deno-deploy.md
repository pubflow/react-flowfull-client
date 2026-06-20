# Deno Deploy

This TanStack Start starter keeps the normal Bun/Node workflow and adds a Deno-friendly path through Nitro.

## Local Deno check

```bash
bun install
bun run build:deno
```

The Vite config includes the Nitro plugin required by Deno Deploy for TanStack Start. Deno Deploy automatically configures the runtime preset for TanStack Start projects.

## Deploy settings

- Framework preset: TanStack Start
- Install command: `deno install --allow-scripts`
- Build command: `bun run build:deno`
- Direct Deno build command: `deno run -A npm:vite build --config vite.deno.config.ts`
- Environment variables: copy the `VITE_*` values from `.env.example`

Keep secrets out of public `VITE_*` variables unless the deployment is intentionally trusted and browser-exposed.
