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
  site: 'https://vinimlo.github.io',
  base: isStatic ? '/gaeia' : '/',
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_MODE': JSON.stringify(process.env.PUBLIC_MODE || 'hybrid'),
    },
    server: {
      watch: {
        // Watch parent vault for content changes
        ignored: ['!../**/*.md']
      }
    }
  }
});
