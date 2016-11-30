'use strict';

var path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    measrCss = new ExtractTextPlugin("measr.css");

module.exports = {
    context: __dirname,
    entry: './src/webpackentry.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'measr.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: measrCss.extract('style-loader', 'css-loader?minimize') },
            { test: /\.woff$/, loader: 'file-loader?name=[name].[ext]&publicPath=font/' },
            { test: /\.png$/, loader: 'file-loader?name=[name].[ext]&publicPath==img/' },
            { test: /\.html$/, loader: 'file-loader?name=[name].[ext]' }
        ]
    },
    plugins: [
        measrCss
    ]
}