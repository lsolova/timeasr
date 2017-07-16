'use strict';

var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    measrCss = new ExtractTextPlugin("timeasr.css"),
    bannerJs = new webpack.BannerPlugin('Timeasr by Laszlo Solova');

module.exports = {
    context: __dirname,
    entry: '../src/client/js/client.js',
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'timeasr.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: measrCss.extract('css-loader?minimize') },
            { test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015']} },
            { test: /\.woff$/, loader: 'file-loader?name=[name].[ext]' },
            { test: /\.png$/, loader: 'file-loader?name=[name].[ext]' },
            { test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
            { test: /\.html$/, loader: 'file-loader?name=[name].[ext]' }
        ]
    },
    plugins: [
        measrCss,
        bannerJs
    ],
    devServer: {
        contentBase: path.join(__dirname, '../dist')
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }

}
