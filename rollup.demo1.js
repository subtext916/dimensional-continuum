// Rollup plugins
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'demo/demo1/demo1.js',
    output: {
        file: 'dist/demo1.js',
        format: 'es'
    },
    plugins: [
        resolve(),
        eslint()
    ]
};
