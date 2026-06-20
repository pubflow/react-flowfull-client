import { defineConfig, mergeConfig } from 'vite'
import { nitro } from 'nitro/vite'
import baseConfig from './vite.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      nitro({
        preset: 'cloudflare-module',
        compatibilityDate: '2026-06-19',
        cloudflare: {
          deployConfig: true,
          nodeCompat: true,
          wrangler: {
            name: 'flowfull-react-client',
            compatibility_date: '2026-06-19',
            compatibility_flags: ['nodejs_compat'],
            observability: { enabled: true },
          },
        },
      }),
    ],
  }),
)
