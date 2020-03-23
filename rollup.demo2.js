// Rollup plugins
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'demo/demo2/demo2.js',
    output: {
        file: 'dist/demo2.js',
        format: 'es'
    },
    plugins: [
        resolve(),
        eslint()
    ]
};
