import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
//import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/es6/dimensional-continuum',
    output: {
        file: 'dist/dimensional-continuum.es.js',
        format: 'es',
        sourcemap: false
    },
    plugins: [
        resolve(),
        eslint()
    ]
};
