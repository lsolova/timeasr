import Vue from 'vue';

import MeasureController from './MeasureController';
import ModelHandler from './ModelHandler';
import MeasureView from './MeasureView';
import SettingsController from './SettingsController';
import SettingsView from './SettingsView';

const views = {};
const controllers = {};
let activeView;

function bindEvents() {
    var switchViewMeasureE = document.getElementById('switchview-measure'),
        switchViewSettingsE = document.getElementById('switchview-settings');

    switchViewMeasureE.addEventListener('click', () => {
        showView('settings');
    });
    switchViewSettingsE.addEventListener('click', () => {
        showView('measure');
    });
}

function init() {
    const vm = new Vue({
        el: '#app-root',
        data: {
            currentView: 'measure',
            taskTypes: []
        },
        methods: {
            start: () => {} // Implemented in MeasureView temporary
        }
    });

    var modelHandler = ModelHandler();
    controllers.measure =new MeasureController(modelHandler);
    controllers.settings = new SettingsController(modelHandler);
    views.measure = new MeasureView('measure', controllers.measure, vm);
    views.settings = new SettingsView('settings', controllers.settings, vm);
    showView('measure');
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
    activeView = views[name];
    activeView.show();
}

export default function () {
    bindEvents();
    init();
}
