import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

const isStatic = process.env.PUBLIC_MODE === 'static';

export default defineConfig({
  // Astro 5: output 'static' is default and supports per-page SSR opt-in
  // In static mode (GitHub Pages), no adapter needed
  // In local mode, use node adapter for API routes
  output: isStatic ? 'static' : 'server',
  ...(isStatic ? {} : {
    adapter: node({ mode: 'standalone' })
  }),
  site: process.env.COSMOS_SITE_URL || (isStatic ? 'https://vinimlo.github.io' : 'http://localhost:4321'),
  base: process.env.COSMOS_BASE_PATH || (isStatic ? '/gaeia' : '/'),
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_MODE': JSON.stringify(process.env.PUBLIC_MODE || 'hybrid'),
    },
    server: {
      hmr: {
        host: 'localhost',
        port: 4322,
      },
      watch: {
        usePolling: true,
        interval: 1000,
        // Watch parent vault for content changes
        ignored: ['!../**/*.md'],
      },
    }
  }
});
