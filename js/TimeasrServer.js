var express = require('express'),
    fs = require('fs'),
    mustache = require('mustache'),
    app = express(),
    ipaddress,
    port;

var walk = function(dir, prefix, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        var i = 0;
        if (err) {
            return done(err);
        }
        (function next() {
            var file = list[i++],
                absoluteFile = dir + '/' + file;
            if (!file) {
                return done(null, results);
            }
            fs.stat(absoluteFile, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(absoluteFile, prefix + file + '/', function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else
                if(!file.endsWith('.appcache'))
                {
                    results.push(prefix + file);
                    next();
                } else {
                    next();
                }
            });
        }());
    });
};

function createAppcacheFile() {
    var rootDir = process.env.PWD;
    walk(rootDir + '/public', '', function (err, list) {
        fs.readFile(rootDir + '/gitid.txt', {encoding: 'utf8'}, function (err, data) {
            var gitid = data;
            fs.readFile(rootDir + '/js/appcache_template.mst', {encoding: 'utf8'}, function(err, data) {
                var template = data,
                    content = {
                        gitid: gitid,
                        cachefiles: list
                    },
                    rendered = mustache.render(template, content);
                fs.writeFile(rootDir + '/public/timeasr.appcache', rendered);
            });

        });
    });
}

module.exports = {
    init: function () {
        ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
        port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
        createAppcacheFile();
    },
    start: function() {
        var rootDir = __dirname + '/../dist';
        app.use('/', express.static(rootDir));
        app.listen(port, ipaddress);
    }
};