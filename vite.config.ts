// Browser preview in Pubflow uses a generated router-only Vite config (TanStack Router SPA).
// Local `npm run dev` keeps full TanStack Start SSR; only the platform Nodepod preview is client-only.
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    viteReact(),
  ],

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@pubflow/core',
      '@pubflow/react',
      'swr'
    ],
    force: false
  },

  server: {
    hmr: {
      overlay: false
    }
  },

  resolve: {
    dedupe: ['react', 'react-dom', '@pubflow/core', 'swr']
  }
})

export default config
