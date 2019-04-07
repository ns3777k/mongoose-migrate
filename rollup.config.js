import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { resolve as resolvePath } from 'path';

export default {
  input: resolvePath(__dirname, 'src', 'cli', 'index.js'),

  output: {
    file: resolvePath(__dirname, 'dist', 'index.js'),
    format: 'cjs',
    indent: false
  },

  external: [
    'mongoose'
  ],

  plugins: [
    json(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
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
