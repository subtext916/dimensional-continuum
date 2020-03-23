// Rollup plugins
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'demo/demo3/demo3.js',
    output: {
        file: 'dist/demo3.js',
        format: 'es'
    },
    plugins: [
        resolve(),
        eslint()
    ]
};
