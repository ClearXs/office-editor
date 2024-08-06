'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var typescript = require('@rollup/plugin-typescript');
var dts = require('rollup-plugin-dts');
var terser = require('@rollup/plugin-terser');
var peerDepsExternal = require('rollup-plugin-peer-deps-external');
var filesize = require('rollup-plugin-filesize');

const packageJson = require('./package.json');

var rollup_config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
      filesize(),
    ],
    external: ['react', 'react-dom', 'styled-components'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'es' }],
    plugins: [dts.default()],
  },
];

exports.default = rollup_config;
