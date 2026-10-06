import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit({ adapter: adapter() })],
  // O app usa os mesmos arquivos da raiz do repositório (app.js, icons.js, seed.js, styles.css).
  server: { fs: { allow: ['..'] } }
});
