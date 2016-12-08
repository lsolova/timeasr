'use strict';

const common = require('../utils/common'),
      domUtils = require('../utils/dom'),
      eventBus = require('../utils/eventBus'),
      TimeUtils = require('../utils/time'),
      View = require('./View');

var SettingsView;
var dailyWlInputE,
        monthlyWlAdjInputE,
        monthlyWlAdjSumE,
        monthLabelE;

    var adjustTextAreaHeight = function () {
        monthlyWlAdjInputE.style.height = monthlyWlAdjInputE.scrollHeight + 'px';
    };
    var bindViewElements = function () {
        dailyWlInputE = document.getElementById('dailywl');
        monthlyWlAdjInputE = document.getElementById('monthlywladj');
        monthlyWlAdjSumE = document.getElementById('monthlywladjsum');
        monthLabelE = document.getElementById('dwlForMonth');
        dailyWlInputE.addEventListener('change', function () {
            eventBus.publish('change:dailywl', {change: dailyWlInputE.value});
        });
        monthlyWlAdjInputE.addEventListener('keypress', adjustTextAreaHeight);
        monthlyWlAdjInputE.addEventListener('focus', function () {
           monthlyWlAdjInputE.setSelectionRange(0,0);
        });
        monthlyWlAdjInputE.addEventListener('change', function () {
            eventBus.publish('change:montlywladj', {change: monthlyWlAdjInputE.value});
        });
    };

    SettingsView = function (viewDomElemId, controllerObj) {
        View.call(this, viewDomElemId, controllerObj, bindViewElements);
        return this;
    };
    common.inherit(SettingsView, View);

    SettingsView.prototype.update = function (data) {
        domUtils.clearAndFill.call(monthLabelE, data.month);
        dailyWlInputE.value = TimeUtils.asHoursAndMinutes(data.dailyWorkload);
        monthlyWlAdjInputE.value = data.monthlyAdjustmentDetails;
        adjustTextAreaHeight();
        domUtils.clearAndFill.call(monthlyWlAdjSumE, TimeUtils.asHoursAndMinutes(data.monthlyAdjustment));
    };

module.exports = SettingsView;