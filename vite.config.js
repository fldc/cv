import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import svelteMd from 'vite-plugin-svelte-md';

export default defineConfig({
  plugins: [
    svelteMd(),
    enhancedImages(),
    sveltekit({
      extensions: ['.svelte', '.md'],
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: undefined,
        precompress: true,
        strict: true,
      }),
      prerender: {
        crawl: true,
        handleHttpError: ({ _path, _referrer, message }) => {
          throw new Error(message);
        },
      },
      preprocess: [vitePreprocess()],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
