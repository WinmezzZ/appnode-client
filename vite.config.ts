import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.join(__dirname, 'src'),
    },
  },
  server: {
    port: 8889,
    proxy: {
      '/api': {
        target: 'https://console.hyyar.com/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, 'api'),
      },
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
});
