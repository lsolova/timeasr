const merge = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

const serverConfig = merge(commonConfig, {
    target: 'node',
    entry: {
        server: './src/server/server.js'
    }
});

module.exports = serverConfig;
