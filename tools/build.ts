import { build, type BuildOptions } from 'esbuild';

const commonOptions: BuildOptions = {
  entryPoints: ['./src/index.tsx', './src/index.css'],
  bundle: true,
  platform: 'browser',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css',
  },
  external: ['path', 'fs', 'react', 'lodash'],
  outdir: './dist'
};

(async () => {
  /* ESModule build (default) */
  await build({
    ...commonOptions,
    format: 'esm',
  }).catch((error) => {
    console.log(error);
    process.exit(1);
  });
  /* CommonJS build */
  await build({
    ...commonOptions,
    format: 'cjs',
    outExtension: { '.js': '.cjs' },
  }).catch((error) => {
    console.log(error);
    process.exit(1);
  });
})();
