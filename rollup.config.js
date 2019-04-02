import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/cli/index.js',
  output: { file: 'dist/index.js', format: 'cjs', indent: false },

  external: [
    'mongoose'
  ],

  plugins: [
    json(),
    commonjs({
      include: 'node_modules/**'
    }),
    resolve({
      browser: false,
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ]
};
