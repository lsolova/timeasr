'use strict';

require('../index.html');
require('../style/measure.css');
const Application = require('./components/Application');

window.onload = function () {
    new Application().init();
}