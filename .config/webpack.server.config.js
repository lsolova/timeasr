const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

const serverConfig = merge(commonConfig, {
    target: 'node',
    entry: {
        server: './src/scripts/server.js'
    }
});

module.exports = serverConfig;
