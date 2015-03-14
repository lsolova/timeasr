"use strict";
define(['tu', 'ct', 'cm'], function (TimeUtils,Controller, common) {
    var currentMonth,
        dailyWorkload,
        monthlyAdjustment,

        self;

    function createViewModel() {
        return {
            month: currentMonth.substr(0,4)+'/'+currentMonth.substr(4),
            dailyWorkload: dailyWorkload,
            monthlyAdjustment: monthlyAdjustment
        }
    }

    var SettingsController = function (modelHandler) {
        Controller.call(this, modelHandler);
        self = this;
        currentMonth = TimeUtils.asMonth(Date.now());
        dailyWorkload = modelHandler.getDailyWorkload(currentMonth);
        monthlyAdjustment = modelHandler.getMonthlyAdjustment(currentMonth);
        common.eventBus.subscribe('change:dailywl', this.setDailyWorkload);
        common.eventBus.subscribe('change:montlywladj', this.setMonthlyAdjustment);
        common.eventBus.subscribe('change:visibility', this.changeVisibility);
        return this;
    };

    common.inherit(SettingsController, Controller);

    SettingsController.prototype.setDailyWorkload = function (changeObj) {
        dailyWorkload = TimeUtils.asMinutes(changeObj.change);
        self.modelHandler.setDailyWorkload(currentMonth, dailyWorkload);
        self.updateView(createViewModel());
    };
    SettingsController.prototype.setMonthlyAdjustment = function (changeObj) {
        monthlyAdjustment = TimeUtils.asMinutes(changeObj.change);
        self.modelHandler.setMonthlyAdjustment(currentMonth, monthlyAdjustment);
        self.updateView(createViewModel());
    };
    SettingsController.prototype.changeVisibility = function(hidden) {
        if ((!hidden.source || hidden.source === 'settings') && !hidden.change) {
            self.updateView(createViewModel());
        }
    };

    return SettingsController;
});