'use strict';

import MeasureController from './MeasureController';
import ModelHandler from './ModelHandler';
import MeasureView from './MeasureView.js';
import SettingsController from './SettingsController';
import SettingsView from './SettingsView';
import Vue from 'vue';
import VueRouter from 'vue-router';
import mView from './vue/MeasureView';
import sView from './vue/SettingsView';

const viewData = {
    viewData: {
        timeInfo: {
            isHidden: true,
            timeValues: {}
        }
    }
}

const views = {};
const controllers = {};
Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        { path: '/settings', component: sView },
        { path: '/measure', component: mView, props: viewData }
    ]
});

new Vue({
    router,
    data: viewData
}).$mount('#app');

let activeView;

function bindEvents() {
    /*var switchViewMeasureE = document.getElementById('switchview-measure'),
        switchViewSettingsE = document.getElementById('switchview-settings');

    switchViewMeasureE.addEventListener('click', () => {
        showView('settings');
    });
    switchViewSettingsE.addEventListener('click', () => {
        showView('measure');
    });*/
}

function init() {
    var modelHandler = ModelHandler();
    controllers.measure =new MeasureController(modelHandler);
    controllers.settings = new SettingsController(modelHandler);
    views.measure = new MeasureView('measure', controllers.measure, viewData);
    views.settings = new SettingsView('settings', controllers.settings);
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
