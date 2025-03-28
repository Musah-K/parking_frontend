import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    proxy: {
      '/graphql': {
        target: 'https://parkingbackend-production-dff7.up.railway.app/graphql',
        // target: 'http://localhost:3001/graphql',
        changeOrigin: true,
      },
    },
  },
});
