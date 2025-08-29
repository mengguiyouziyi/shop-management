import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './apps/web/src/setupTests.ts',
    include: [
      'apps/web/src/__tests__/**/*.test.{ts,tsx}',
      'packages/**/*.{test,spec}.{ts,tsx}'
    ],
  },
})