import * as path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

const ENV = process.env.NODE_ENV || 'development'
const ROOT = path.resolve(__dirname, '../')
const BASE = path.join(ROOT, 'projects/server')
const INPUT = path.join(BASE, 'index.ts')
const OUTPUT = path.join(ROOT, 'dist/server')
const TS_CONFIG = path.join(ROOT, 'tsconfig.json')

const external = (() => {
  const dependencies = require(path.join(BASE, 'package.json')).dependencies || {}
  const keys = ['@shared', ...Object.keys(dependencies)].map((key) => new RegExp(`^${key}`))
  return (id) => keys.some((key) => key.test(id))
})()

export default {
  context: 'this',
  input: INPUT,
  output: {
    dir: OUTPUT,
    format: 'cjs',
    sourcemap: true,
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
  external,
}
