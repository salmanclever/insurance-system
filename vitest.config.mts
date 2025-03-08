import { defineConfig } from 'vitest/config';
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, 
    environment: 'jsdom', // Simulates a browser for React components
    setupFiles: ['./vitest.setup.js'], // Optional setup file (created in Step 3)
  },
  resolve: {
    alias: [
      {
        find: /\.(css|less|scss|sass)$/, // Matches CSS-related imports
        replacement: path.resolve(__dirname, '__mocks__/styleMock.ts'), // Mocks them globally
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './'), // Resolves other imports to the 'src' directory
      },
    ],
  },
});