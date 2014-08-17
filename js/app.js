"use strict";
require.config({
    baseUrl: 'js/lib',
    paths: {
        mc: '../app/MeasureController',
        mt: '../app/MeasureTime',
        ms: '../app/MeasureStorage',
        mv: '../app/MeasureView',
        tu: '../app/TimeUtils'
    }
});
require(['mv', 'mc'], function (MeasureView, MeasureController) {
    new MeasureView('measureView', new MeasureController());
});