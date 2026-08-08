// Browser preview in Pubflow uses a generated TanStack Start SPA config (client-only).
// Local `npm run dev` keeps full TanStack Start SSR; only the platform Nodepod preview is client-only.
import { defineConfig, type PluginOption } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export function createAppConfig(extraPlugins: PluginOption[] = []) {
  return defineConfig({
    plugins: [
      tailwindcss(),
      tanstackStart({
        srcDirectory: 'src',
      }),
      viteReact(),
      ...extraPlugins,
    ],

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@pubflow/core',
        '@pubflow/react',
        'swr',
      ],
      force: false,
    },

    server: {
      port: 3000,
      hmr: {
        overlay: false,
      },
    },

    resolve: {
      tsconfigPaths: true,
      dedupe: ['react', 'react-dom', '@pubflow/core', 'swr'],
    },
  })
}

export default createAppConfig([nitro()])
