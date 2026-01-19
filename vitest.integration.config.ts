import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.integration.test.{ts,tsx}'],
    testTimeout: 30000,
    retry: 2,
  },
});
