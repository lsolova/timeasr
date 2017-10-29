const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common.config');

const gitInfo = new GitRevisionPlugin();

const clientConfig = merge(commonConfig, {
    entry: {
        timeasr: './src/client/js/client.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, use: ExtractTextPlugin.extract('css-loader?minimize') },
            { test: /\.woff|\.png|\.ico|\.html$/, loader: 'file-loader?name=[name].[ext]' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('timeasr.css'),
        new webpack.BannerPlugin('Timeasr by Laszlo Solova'),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/client/index.ejs',
            version: gitInfo.version()
        }),
        new CopyWebpackPlugin([
            { from: './src/client/assets', to: '.' }
        ])
    ]
});

module.exports = clientConfig;
