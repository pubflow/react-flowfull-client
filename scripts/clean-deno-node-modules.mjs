import { rmSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const denoModules = path.resolve(root, '..', 'node_modules', '.deno')

if (existsSync(denoModules)) {
  rmSync(denoModules, { recursive: true, force: true })
  console.log('Removed node_modules/.deno to keep npm React resolution clean')
}
