"use strict";
require.config({
    baseUrl: 'js/lib',
    paths: {
        ap: '../app/Application',
        cm: '../app/common',
        ct: '../app/Controller',
        mc: '../app/MeasureController',
        mt: '../app/MeasureTime',
        ms: '../app/MeasureStorage',
        mv: '../app/MeasureView',
        sc: '../app/SettingsController',
        sv: '../app/SettingsView',
        tu: '../app/TimeUtils',
        du: '../app/DomUtils',
        vw: '../app/View'
    }
});
require(['ap'], function (Application) {
    var timeasr = new Application();
    timeasr.init();
});