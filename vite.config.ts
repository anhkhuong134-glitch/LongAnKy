import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DOC_ID = '1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y';
const GOOGLE_DOCS_EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'google-docs-sync-proxy',
      configureServer(server) {
        server.middlewares.use('/api/sync-google-doc', async (_req, res) => {
          try {
            const response = await fetch(GOOGLE_DOCS_EXPORT_URL, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            if (!response.ok) {
              res.statusCode = response.status;
              res.end(JSON.stringify({ error: `Google Doc export failed with status ${response.status}` }));
              return;
            }
            const text = await response.text();
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(text);
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Failed to fetch Google Doc' }));
          }
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
