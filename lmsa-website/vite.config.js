import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Dev-only admin preview (T42): when Vite runs with `--mode preview`, the
// auth singleton is pointed at src/dev/mockAuth.js so the admin shell can
// render with a mocked session for device-matrix screenshots. The alias
// exists only in that mode — regular `dev` against a real backend and every
// `build` resolve '@services/supabase' normally, so the mock module cannot
// be compiled into a production bundle. No runtime guard is needed:
// production simply never references the mock.
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      // Preview alias MUST be first: '@services' (below) is a prefix match
      // and would otherwise swallow '@services/supabase' before this entry
      // is consulted. Mode-gated so it never applies to dev/build (the mock
      // module cannot reach a production bundle).
      // serve+preview only: even `vite build --mode preview` cannot pull the
      // mock into a bundle.
      ...(command === 'serve' && mode === 'preview'
        ? {
            '@services/supabase': path.resolve(__dirname, './src/dev/mockAuth.js'),
            '@services/api': path.resolve(__dirname, './src/dev/mockApi.js'),
          }
        : {}),
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    allowedHosts: true,
    // Dev convenience: lets VITE_API_URL=/api work by forwarding to a
    // locally running backend (lmsa-api defaults to port 5000).
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
}));
