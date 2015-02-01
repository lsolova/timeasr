var express = require('express'),
    workdayResolver = require('./WorkdayResolver'),
    app = express(),
    ipaddress,
    port;

module.exports = {
    init: function () {
        ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
        port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    },
    start: function() {
        var rootDir = __dirname + '/../public',
            year,
            month;
        app.use('/api/workdays/:year/:month', function (req, res) {
            year = parseInt(req.params.year, 10);
            month = parseInt(req.params.month, 10);
            res.send(workdayResolver.getWorkDays(year, month));
        });
        app.use('/', express.static(rootDir));
        app.listen(port, ipaddress);
    }
};