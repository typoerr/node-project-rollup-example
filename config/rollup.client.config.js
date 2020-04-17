import * as path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

const ENV = process.env.NODE_ENV || 'development'
const IS_PROD = ENV === 'production'
const ROOT = path.resolve(__dirname, '../')
const BASE = path.join(ROOT, 'projects/client')
const INPUT = path.join(BASE, 'index.ts')
const OUTPUT = path.join(ROOT, 'dist/client')
const TS_CONFIG = path.join(ROOT, 'tsconfig.json')

export default {
  context: 'window',
  input: INPUT,
  output: {
    dir: OUTPUT,
    format: 'iife',
    sourcemap: true,
    plugins: IS_PROD ? [terser()] : [],
  },
  plugins: [
    typescript({
      tsconfig: TS_CONFIG,
      module: 'ESNext',
      exclude: ['**/node_modules/**', '**/*.test.ts'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(ENV),
    }),
    commonjs(),
    resolve(),
  ],
}
