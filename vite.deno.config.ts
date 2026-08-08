import { nitro } from 'nitro/vite'
import { createAppConfig } from './vite.config.ts'

export default createAppConfig([
  nitro({
    preset: 'deno-deploy',
  }),
])
