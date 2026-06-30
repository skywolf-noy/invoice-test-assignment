import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: [
      'app/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
    setupFiles: [
      './tests/setup.ts',
    ],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        '.output/',
        'tests/',
      ],
    },
  },
})
