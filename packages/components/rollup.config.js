import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import filesize from 'rollup-plugin-filesize';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';

const pkg = require('./package.json');

export default {
  input: './src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url({ exclude: ['**/*.svg'] }),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      externalHelpers: true
    }),
    resolve(),
    commonjs(),
    filesize()
  ],
  external(id) {
    return !/^[\.\/]/.test(id);
  }
};
