const path = require('path');

const commonConfig = {
    context: path.resolve(__dirname, '..'),
    output: {
        path: path.join(__dirname, '../build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.[jt]sx?$/, loader: 'babel-loader', options: { presets: ["@babel/env", "@babel/react", "@babel/typescript"]} }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        modules: ['src', 'node_modules']
    },
    devServer: {
        static: path.join(__dirname, '../build')
    },
    devtool: 'source-map'
}

module.exports = commonConfig;
