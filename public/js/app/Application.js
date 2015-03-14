"use strict";
define(['cm', 'du', 'sc', 'sv', 'mc', 'mv', 'ms'], function (common, DomUtils, SettingsController, SettingsView, MeasureController, MeasureView, MeasureStorage) {
    var views = {},
        controllers = {},
        activeView;

    var Application = function () {
        var switchViewMeasureE = document.getElementById('switchview-measure');
        var switchViewSettingsE = document.getElementById('switchview-settings');
        switchViewMeasureE.addEventListener('click', function () {
            common.eventBus.publish('click:viewchange', { change: 'settings' });
        });
        switchViewSettingsE.addEventListener('click', function () {
            common.eventBus.publish('click:viewchange', { change: 'measure' });
        });
    };

    Application.prototype.init = function () {
        var measureStorage = new MeasureStorage();
        controllers.measure = new MeasureController(measureStorage);
        controllers.settings = new SettingsController(measureStorage);
        views.measure = new MeasureView('measure', controllers.measure);
        views.settings = new SettingsView('settings', controllers.settings);
        common.eventBus.subscribe('click:viewchange', self.showView);
        this.showView({change: 'measure'});
    };

    Application.prototype.showView = function (name) {
        if (activeView) {
            activeView.hide();
        } else {
            for(var view in views) {
                if (views.hasOwnProperty(view)) {
                    views[view].hide();
                }
            }
        }
        activeView = views[name.change];
        activeView.show();
    };

    return Application;
});