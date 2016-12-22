'use strict';

var timeasrSrv;

require('./src/server/shim');
timeasrSrv = require('./src/server/TimeasrServer');
timeasrSrv.init();
timeasrSrv.start();