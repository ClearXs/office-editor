'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var typescript = require('rollup-plugin-typescript2');
var dts = require('rollup-plugin-dts');
var peerDepsExternal = require('rollup-plugin-peer-deps-external');
var filesize = require('rollup-plugin-filesize');
var json = require('@rollup/plugin-json');
var vue = require('rollup-plugin-vue2');

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
      vue(),
      peerDepsExternal(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      typescript(),
      filesize(),
      json(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'es' }],
    plugins: [vue(), typescript(), dts.default()],
  },
];

exports.default = rollup_config;
