const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoPreprocess = require('svelte-preprocess');

const commonConfig = require('./webpack.common.config');
const gitInfo = new GitRevisionPlugin();

const clientConfig = merge(commonConfig, {
    mode: 'development',
    entry: {
        timeasrapp: './src/client.tsx',
        timeasrsw: "./src/service-worker.ts",
    },
    module: {
        rules: [
            { test: /\.s?css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] },
            { test: /\.woff|\.png|\.ico|\.html$/, loader: 'file-loader', options: {name: '[name].[ext]'} },
            { test: /\.svelte/, loader: "svelte-loader", options: {
                preprocess: autoPreprocess()
            } },
            { test: /\.svg/, use: ['@svgr/webpack', 'url-loader']}
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'timeasrapp.css' }),
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
