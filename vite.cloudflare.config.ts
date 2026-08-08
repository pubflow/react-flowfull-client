import { nitro } from 'nitro/vite'
import { createAppConfig } from './vite.config.ts'

export default createAppConfig([
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
])
