// Rollup plugins
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import resolve from 'rollup-plugin-node-resolve';
import multiEntry from 'rollup-plugin-multi-entry';
import eslint from 'rollup-plugin-eslint';

export default {
    input: 'test/es6/**/*.js',
    output: {
        file: 'test/transpiled/tests.js',
        format: 'es',
        sourcemap: false
    },
    plugins: [
        resolve(),
        multiEntry(),
        eslint(),
        babel(babelrc())
    ]
};
