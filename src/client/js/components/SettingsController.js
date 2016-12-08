'use strict';

const common = require('../utils/common'),
      Controller = require('./Controller'),
      eventBus = require('../utils/eventBus'),
      timeUtils = require('../utils/time');

var SettingsController,
        currentMonth,
        dailyWorkload,
        monthlyAdjustment,
        monthlyAdjustmentDetails,
        self;

    function loadData(actualMonth) {
        dailyWorkload = self.modelHandler.getDailyWorkload(actualMonth);
        monthlyAdjustmentDetails = self.modelHandler.getMonthlyAdjustment(actualMonth);
        monthlyAdjustment = timeUtils.calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
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

    SettingsController = function (modelHandler) {
        Controller.call(this, modelHandler);
        self = this;
        currentMonth = timeUtils.asMonth(Date.now());
        loadData(currentMonth);
        eventBus.subscribe('change:dailywl', this.setDailyWorkload);
        eventBus.subscribe('change:montlywladj', this.setMonthlyAdjustment);
        eventBus.subscribe('change:visibility', this.changeVisibility);
        return this;
    };

    common.inherit(SettingsController, Controller);

    SettingsController.prototype.setDailyWorkload = function (changeObj) {
        dailyWorkload = timeUtils.asMinutes(changeObj.change);
        self.modelHandler.setDailyWorkload(currentMonth, dailyWorkload);
        self.updateView(createViewModel());
    };
    SettingsController.prototype.setMonthlyAdjustment = function (changeObj) {
        monthlyAdjustmentDetails = changeObj.change;
        monthlyAdjustment = timeUtils.calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
        self.modelHandler.setMonthlyAdjustment(currentMonth, monthlyAdjustmentDetails);
        self.updateView(createViewModel());
    };
    SettingsController.prototype.changeVisibility = function(hidden) {
        if ((!hidden.source || hidden.source === 'settings') && !hidden.change) {
            self.updateView(createViewModel());
        }
    };

module.exports = SettingsController;