"use strict";
define(['tu', 'ct', 'cm'], function (TimeUtils, Controller, common) {
    var currentMonth,
        dailyWorkload,
        monthlyAdjustment,
        monthlyAdjustmentDetails,
        self;

    function loadData(actualMonth) {
        dailyWorkload = self.modelHandler.getDailyWorkload(actualMonth);
        monthlyAdjustmentDetails = self.modelHandler.getMonthlyAdjustment(actualMonth);
        monthlyAdjustment = TimeUtils.calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
    }

    function createViewModel() {
        var actualMonth = self.modelHandler.getActualDay().getYearAndMonth('');
        if (currentMonth !== actualMonth) {
            currentMonth = actualMonth;
            loadData(currentMonth);
        }
        return {
            month: currentMonth.substr(0,4)+'/'+currentMonth.substr(4),
            dailyWorkload: dailyWorkload,
            monthlyAdjustment: monthlyAdjustment,
            monthlyAdjustmentDetails: monthlyAdjustmentDetails
        }
    }

    var SettingsController = function (modelHandler) {
        Controller.call(this, modelHandler);
        self = this;
        currentMonth = TimeUtils.asMonth(Date.now());
        loadData(currentMonth);
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
        monthlyAdjustmentDetails = changeObj.change;
        monthlyAdjustment = TimeUtils.calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
        self.modelHandler.setMonthlyAdjustment(currentMonth, monthlyAdjustmentDetails);
        self.updateView(createViewModel());
    };
    SettingsController.prototype.changeVisibility = function(hidden) {
        if ((!hidden.source || hidden.source === 'settings') && !hidden.change) {
            self.updateView(createViewModel());
        }
    };

    return SettingsController;
});