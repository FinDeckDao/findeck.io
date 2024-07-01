/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import dotenv from 'dotenv'
import environment from 'vite-plugin-environment'
import react from '@vitejs/plugin-react'

dotenv.config({ path: '../../.env' })

export default defineConfig({
  build: {
    emptyOutDir: true,
    target: 'esnext'
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts'
  },
  resolve: {
    alias: [
      {
        find: 'declarations',
        replacement: fileURLToPath(new URL('../declarations', import.meta.url))
      }
    ]
  }
})
