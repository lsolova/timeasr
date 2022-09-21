const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common.config');
const gitInfo = new GitRevisionPlugin();

const clientConfig = merge(commonConfig, {
    mode: 'development',
    entry: {
        timeasr: './src/client/js/client.js'
    },
    module: {
        rules: [
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.woff|\.png|\.ico|\.html$/, loader: 'file-loader', options: {name: '[name].[ext]'} },
            { test: /\.svg/, use: ['@svgr/webpack', 'url-loader']}
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'timeasr.css' }),
        new webpack.BannerPlugin('Timeasr by Laszlo Solova'),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/client/index.ejs',
            version: gitInfo.version()
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/assets', to: '.' }
            ]
        })
    ]
});

module.exports = clientConfig;
