import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


import fs from 'fs'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function serveOldSiteMiddleware() {
  return {
    name: 'serve-old-site-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/old/') || req.url === '/old')) {
          let targetPath = req.url;
          if (targetPath === '/old' || targetPath === '/old/') {
            targetPath = '/old/index.html';
          }
          
          targetPath = targetPath.split('?')[0];
          const filePath = path.join(__dirname, 'public', targetPath);
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath);
            const contentType: Record<string, string> = {
              '.html': 'text/html',
              '.js': 'application/javascript',
              '.css': 'text/css',
              '.svg': 'image/svg+xml',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.mp4': 'video/mp4',
            };
            
            res.writeHead(200, { 'Content-Type': contentType[ext] || 'text/plain' });
            res.end(fs.readFileSync(filePath));
            return;
          }
        }
        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    serveOldSiteMiddleware(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
