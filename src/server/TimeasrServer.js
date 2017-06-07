var express = require('express'),
    appRoot = "/dist",
    app = express(),
    ipaddress,
    port;

module.exports = {
    init: function () {
        ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
        port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    },
    start: function() {
        var rootDir = __dirname + '/..' + appRoot;
        app.use('/', express.static(rootDir));
        app.listen(port, ipaddress);
    }
};
