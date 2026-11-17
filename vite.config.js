import { defineConfig } from 'vite';

// GitHub Pages serves this repo from /duramaxsimulator/, not the domain root.
// A relative base keeps built assets working from any subpath.
export default defineConfig({
  base: './',
});
