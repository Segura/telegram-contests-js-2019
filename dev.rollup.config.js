import css from 'rollup-plugin-css-porter';

module.exports = {
    input: './src/index.js',
    output: {
        file: './build/bundle.js',
        format: 'iife',
        name: 'Graph'
    },
    plugins: [ css({minified: false}) ]
};
