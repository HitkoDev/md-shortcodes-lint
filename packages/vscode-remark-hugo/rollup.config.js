import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    input: 'dist/index.js',
    output: {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true
    },
    plugins: [
        sourcemaps(),
        commonjs(),
        resolve(),
        json()
    ]
};
