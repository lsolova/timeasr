"use strict";
define(['tu', 'du', 'vw', 'cm'], function (TimeUtils, DomUtils, View, common) {

    var dailyWlInputE,
        monthlyWlAdjInputE,
        monthlyWlAdjSumE,
        monthLabelE;
    var bindViewElements = function () {
        dailyWlInputE = document.getElementById('dailywl');
        monthlyWlAdjInputE = document.getElementById('monthlywladj');
        monthlyWlAdjSumE = document.getElementById('monthlywladjsum');
        monthLabelE = document.getElementById('dwlForMonth');
        dailyWlInputE.addEventListener('change', function () {
            common.eventBus.publish('change:dailywl', {change: dailyWlInputE.value});
        });
        monthlyWlAdjInputE.addEventListener('change', function () {
            common.eventBus.publish('change:montlywladj', {change: monthlyWlAdjInputE.value});
        });
    };

    var SettingsView = function (viewDomElemId, controllerObj) {
        View.call(this, viewDomElemId, controllerObj, bindViewElements);
        return this;
    };
    common.inherit(SettingsView, View);

    SettingsView.prototype.update = function (data) {
        DomUtils.clearAndFill(monthLabelE, data.month);
        dailyWlInputE.value = TimeUtils.asHoursAndMinutes(data.dailyWorkload);
        monthlyWlAdjInputE.value = data.monthlyAdjustmentDetails;
        DomUtils.clearAndFill(monthlyWlAdjSumE, TimeUtils.asHoursAndMinutes(data.monthlyAdjustment));
    };

    return SettingsView;
});