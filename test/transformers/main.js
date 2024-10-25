const { extname } = require('path');

const { transformSync } = require('esbuild');

const loaders = {
  '.ts': 'ts',
  '.js': 'js',
  '.jsx': 'jsx',
  '.tsx': 'tsx',
  '.json': 'json',
};

module.exports = {
  process(sourceText, sourcePath) {
    const ext = extname(sourcePath);
    return transformSync(sourceText, {
      format: 'cjs',
      loader: loaders[ext],
    });
  },
};
