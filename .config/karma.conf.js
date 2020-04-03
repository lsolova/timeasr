var webpackConfig = require('./webpack.client.config');
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
    config.set({
        basePath: '..',
        frameworks: ['mocha'],
        files: [
            'src/**/*.test.js'
        ],
        preprocessors: {
            'src/**/*.test.js': ['webpack', 'sourcemap']
        },
        reporters: ['mocha'],
        webpack: webpackConfig
    });
}
