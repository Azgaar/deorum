import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    scss: {
      prependData: '@use "src/theme/variables.scss" as *;'
    }
  }),

  kit: {
    adapter: adapter(),

    alias: {
      theme: 'src/theme/_smui-scss'
    }
  },

  files: {
    lib: 'src/lib'
  }
};

export default config;
