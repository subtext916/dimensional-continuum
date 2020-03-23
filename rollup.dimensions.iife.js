import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/es6/dimensional-continuum',
    output: {
        file: 'dist/dimensional-continuum.js',
        format: 'iife',
        name: 'dimensionalContinuum'
    },
    plugins: [
        resolve(),
        commonjs(),
        eslint(),
        babel(babelrc())
    ]
};
