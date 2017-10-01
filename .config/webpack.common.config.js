const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
    context: path.resolve(__dirname, '..'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: 'babel-loader', query: { presets: ['env', 'react']} }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: ['src', 'node_modules']
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist')
    },
    devtool: 'source-map'
}

module.exports = commonConfig;
