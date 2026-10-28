import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vite';

export default defineConfig(({ command, isPreview }) => ({
  plugins: [
    tailwindcss(),
    sveltekit({
      paths: {
        base: command === 'serve' && !isPreview ? '' : '/polymer-clay-recipe-calculator'
      },
      adapter: adapter({ pages: 'build', assets: 'build', precompress: false })
    })
  ]
}));
