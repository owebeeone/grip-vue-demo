import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    exclude: ['@owebeeone/grip-core', '@owebeeone/grip-vue'],
    // Don't include process/browser in optimizeDeps - it causes issues
    // The aliases will handle the resolution
  },
  resolve: {
    alias: {
      // Polyfill Node.js built-in modules for browser compatibility
      // These aliases apply to ALL imports, including from pre-built bundles
      'util': resolve(__dirname, 'node_modules/util/util.js'),
      'path': resolve(__dirname, 'node_modules/path-browserify/index.js'),
      'process': resolve(__dirname, 'node_modules/process/browser.js'),
    },
  },
  define: {
    // Define process.env for consola
    'process.env.NODE_ENV': JSON.stringify(process.env?.NODE_ENV || 'development'),
    global: 'globalThis',
  },
})

