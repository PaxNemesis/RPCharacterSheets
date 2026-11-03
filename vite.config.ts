import { fileURLToPath } from 'node:url'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH ?? '/',
  // The router plugin must come before the React plugin. Tests don't need the route tree.
  plugins: [...(process.env.VITEST ? [] : [tanstackRouter({ target: 'react', autoCodeSplitting: true })]), react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
  },
})
