import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import filesize from 'rollup-plugin-filesize'
import json from '@rollup/plugin-json'
import vue from '@vitejs/plugin-vue'

const packageJson = require('./package.json')

export default [
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
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
      filesize(),
      json(),
    ],
    external: ['react', 'react-dom', 'styled-components'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'es' }],
    plugins: [vue(), typescript(), dts.default()],
  },
]
