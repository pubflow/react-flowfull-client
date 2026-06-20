import { defineConfig, mergeConfig } from 'vite'
import { nitro } from 'nitro/vite'
import baseConfig from './vite.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      nitro({
        preset: 'deno-deploy',
      }),
    ],
  }),
)
