'use strict';

const eventBus = require('../utils/eventBus'),
      MeasureController = require('./MeasureController'),
      MeasureStorage = require('./MeasureStorage'),
      MeasureView = require('./MeasureView'),
      SettingsController = require('./SettingsController'),
      SettingsView = require('./SettingsView');
var Application,
    views = {},
    controllers = {},
    activeView;

Application = function () {
    this.bindEvents();
};

Application.prototype.bindEvents = function bindEvents() {
    var switchViewMeasureE = document.getElementById('switchview-measure'),
        switchViewSettingsE = document.getElementById('switchview-settings');

    switchViewMeasureE.addEventListener('click', function () {
        eventBus.publish('click:viewchange', { change: 'settings' });
    });
    switchViewSettingsE.addEventListener('click', function () {
        eventBus.publish('click:viewchange', { change: 'measure' });
    });
}

Application.prototype.init = function init() {
    var measureStorage = new MeasureStorage();
    controllers.measure = new MeasureController(measureStorage);
    controllers.settings = new SettingsController(measureStorage);
    views.measure = new MeasureView('measure', controllers.measure);
    views.settings = new SettingsView('settings', controllers.settings);
    eventBus.subscribe('click:viewchange', this.showView);
    this.showView({change: 'measure'});
};

Application.prototype.showView = function showView(name) {
    var view;
    if (activeView) {
        activeView.hide();
    } else {
        for(view in views) {
            if (views.hasOwnProperty(view)) {
                views[view].hide();
            }
        }
    }
    activeView = views[name.change];
    activeView.show();
};

module.exports = Application;