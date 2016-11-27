'use strict';

var timeasrSrv;

require('./js/shim');
timeasrSrv = require('./js/TimeasrServer');
timeasrSrv.init();
timeasrSrv.start();