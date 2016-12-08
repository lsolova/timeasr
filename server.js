'use strict';

var timeasrSrv;

require('./js/shim');
timeasrSrv = require('./src/server/TimeasrServer');
timeasrSrv.init();
timeasrSrv.start();