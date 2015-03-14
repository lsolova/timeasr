"use strict";
define(['tu', 'du', 'vw', 'cm'], function (TimeUtils, DomUtils, View, common) {

    var dailyWlInputE,
        montlyWlAdjInputE,
        monthLabelE;
    var bindViewElements = function () {
        dailyWlInputE = document.getElementById('dailywl');
        montlyWlAdjInputE = document.getElementById('monthlywladj');
        monthLabelE = document.getElementById('dwlForMonth');
        dailyWlInputE.addEventListener('change', function () {
            common.eventBus.publish('change:dailywl', {change: dailyWlInputE.value});
        });
        montlyWlAdjInputE.addEventListener('change', function () {
            common.eventBus.publish('change:montlywladj', {change: montlyWlAdjInputE.value});
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
        montlyWlAdjInputE.value = TimeUtils.asHoursAndMinutes(data.monthlyAdjustment);
    };

    return SettingsView;
});