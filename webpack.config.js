'use strict';

var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    measrCss = new ExtractTextPlugin("measr.css"),
    uglifyJs = new webpack.optimize.UglifyJsPlugin(),
    bannerJs = new webpack.BannerPlugin('Timeasr by Laszlo Solova');

module.exports = {
    context: __dirname,
    entry: './src/js/client.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'measr.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: measrCss.extract('css-loader?minimize') },
            { test: /\.woff$/, loader: 'file-loader?name=[name].[ext]&publicPath=font/' },
            { test: /\.png$/, loader: 'file-loader?name=[name].[ext]&publicPath==img/' },
            { test: /\.html$/, loader: 'file-loader?name=[name].[ext]' }
        ]
    },
    plugins: [
        measrCss,
        uglifyJs,
        bannerJs
    ]
}