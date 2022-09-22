import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      theme: 'src/theme/_smui-theme.scss'
    }
  },

  files: {
    lib: 'src/lib'
  }
};

export default config;
