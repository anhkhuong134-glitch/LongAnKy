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
        server.middlewares.use('/api/auth', async (req, res) => {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              (req as any).body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              (req as any).body = {};
            }
            const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
            (req as any).query = Object.fromEntries(urlObj.searchParams.entries());
            (res as any).status = (code: number) => {
              res.statusCode = code;
              return res;
            };
            (res as any).json = (data: any) => {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify(data));
              return res;
            };
            try {
              const authModule = await import('./api/auth.js');
              await authModule.default(req, res);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: err.message || 'Auth internal error' }));
            }
          });
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
