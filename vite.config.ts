import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'imagekit-auth',
      configureServer(server) {
        server.middlewares.use('/api/imagekit/auth', (_req, res) => {
          // Import dynamically to avoid TypeScript issues
          import('./src/server/imagekit').then(({ getAuthenticationParameters }) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(getAuthenticationParameters()));
          }).catch(error => {
            console.error('Error loading imagekit auth:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
          });
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      crypto: 'crypto-browserify',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'global': {},
  },
  optimizeDeps: {
    include: ['bcryptjs'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/bcryptjs/],
    },
  },
})
