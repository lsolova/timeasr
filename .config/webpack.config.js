const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const autoPreprocess = require('svelte-preprocess');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const webpack = require('webpack');

const gitInfo = new GitRevisionPlugin();

const commonConfig = {
    context: path.resolve(__dirname, ".."),
    entry: {
        timeasrapp: "./src/client.ts",
        timeasrsw: "./src/service-worker.ts",
    },
    output: {
        path: path.join(__dirname, "../build"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".js", ".json", ".jsx", ".svelte", ".ts", ".tsx"],
        modules: ["src", "node_modules"],
    },
    mode: "development",
    module: {
        rules: [
            { test: /\.s?css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] },
            {
                test: /\.svelte/,
                loader: "svelte-loader",
                options: {
                    preprocess: autoPreprocess(),
                },
            },
            { test: /\.[jt]sx?$/, loader: "babel-loader" },
            { test: /manifest\.json|\.svg|\.png|\.html$/, loader: "file-loader", options: { name: "[name].[ext]" } },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "timeasrapp.css" }),
        new webpack.BannerPlugin("Timeasr by Laszlo Solova"),
        new HtmlWebpackPlugin({
            filename: "./index.html",
            template: "./src/index.ejs",
            version: gitInfo.version(),
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: "./src/assets", to: "." }],
        }),
    ],
    devServer: {
        static: path.join(__dirname, "../build"),
    },
    devtool: "source-map",
};

module.exports = commonConfig;
