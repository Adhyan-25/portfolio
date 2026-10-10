import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative, so the build works on GitHub Pages
// project sites (user.github.io/repo/) as well as on a root domain.
export default defineConfig({
  base: './',
  plugins: [react()],
});
