import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  // Compresses images under src/ on build (PNG/JPEG/WebP/SVG) so future
  // assets (bike photos, event images, etc.) don't need manual optimizing.
  plugins: [react(), ViteImageOptimizer()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
