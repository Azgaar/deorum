import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { sveltekit } from '@sveltejs/kit/vite';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';

import type { OutputOptions } from 'rollup';
import type { UserConfig } from 'vite';

const CompileServiceWorker = () => ({
  name: 'compile-service-worker',
  async writeBundle() {
    const inputOptions = {
      input: 'src/sw.js',
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          preventAssignment: true
        }),
        terser(),
        nodeResolve()
      ]
    };
    const outputOptions: OutputOptions = { file: '.svelte-kit/output/client/sw.js', format: 'es' };
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
    await bundle.close();
  }
});

const config: UserConfig = {
  plugins: [sveltekit(), CompileServiceWorker()]
};

export default config;
