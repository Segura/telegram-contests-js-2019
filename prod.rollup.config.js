import css from 'rollup-plugin-css-porter'
import { terser } from 'rollup-plugin-terser'

module.exports = {
    input: './src/index.js',
    output: {
        file: './build/bundle.min.js',
        format: 'iife',
        name: 'Graph',
        compact: true,
        indent: false
    },
    plugins: [
        css({
            raw: false,
            minified: './build/bundle.min.css'
        }),
        terser()
    ]
}
