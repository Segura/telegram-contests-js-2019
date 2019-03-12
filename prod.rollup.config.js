import css from 'rollup-plugin-css-porter';

module.exports = {
    input: './src/index.js',
    output: {
        file: './build/bundle.js',
        format: 'iife',
        name: 'Graph',
        compact: true,
        indent: false
    },
    plugins: [ css() ]
};
