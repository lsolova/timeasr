'use strict';

import * as eventBus from '../utils/eventBus';
import MeasureController from './MeasureController';
import ModelHandler from './ModelHandler';
import MeasureView from './MeasureView.jsx';
import SettingsController from './SettingsController';
import SettingsView from './SettingsView';

const views = {};
const controllers = {};
let activeView;

function bindEvents() {
    var switchViewMeasureE = document.getElementById('switchview-measure'),
        switchViewSettingsE = document.getElementById('switchview-settings');

    switchViewMeasureE.addEventListener('click', function () {
        eventBus.publish('click:viewchange', { change: 'settings' });
    });
    switchViewSettingsE.addEventListener('click', function () {
        eventBus.publish('click:viewchange', { change: 'measure' });
    });
}

function init() {
    var modelHandler = ModelHandler();
    controllers.measure =new MeasureController(modelHandler);
    controllers.settings = new SettingsController(modelHandler);
    views.measure = new MeasureView('measure', controllers.measure);
    views.settings = new SettingsView('settings', controllers.settings);
    eventBus.subscribe('click:viewchange', showView);
    showView({change: 'measure'});
}

function showView(name) {
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
}

export default function () {
    bindEvents();
    init();
}
