'use strict';

import Controller from './Controller';
import { inherit } from '../utils/common';
import * as eventBus from '../utils/eventBus';
import * as timeConversionUtils from '../utils/timeConversion';
import { now } from '../utils/dateWrapper';
import { calculateMonthlyAdjustmentFromDetails } from '../utils/timeCalculation';

var SettingsController,
        currentMonth,
        dailyWorkload,
        monthlyAdjustment,
        monthlyAdjustmentDetails;

    function loadData(actualMonth) {
        dailyWorkload = this.modelHandler.getDailyWorkload(actualMonth);
        monthlyAdjustmentDetails = this.modelHandler.getMonthlyAdjustment(actualMonth);
        monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
    }

    function createViewModel() {
        var actualMonth = this.modelHandler.getActualDay().getYearAndMonth('');
        if (currentMonth !== actualMonth) {
            currentMonth = actualMonth;
            loadData.call(this, currentMonth);
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
        currentMonth = timeConversionUtils.asMonth(now());
        loadData.call(this, currentMonth);
        eventBus.subscribe('change:dailywl', setDailyWorkload);
        eventBus.subscribe('change:montlywladj', setMonthlyAdjustment);
        eventBus.subscribe('change:visibility', changeVisibility.bind(this));
    };
    inherit(SettingsController, Controller);

    function setDailyWorkload(changeObj) {
        dailyWorkload = timeConversionUtils.asMinutes(changeObj.change);
        this.modelHandler.setDailyWorkload(currentMonth, dailyWorkload);
        this.updateView(createViewModel());
    }
    function setMonthlyAdjustment(changeObj) {
        monthlyAdjustmentDetails = changeObj.change;
        monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
        this.modelHandler.setMonthlyAdjustment(currentMonth, monthlyAdjustmentDetails);
        this.updateView(this.createViewModel());
    }
    function changeVisibility(hidden) {
        if ((!hidden.source || hidden.source === 'settings') && !hidden.change) {
            this.updateView(createViewModel.call(this));
        }
    }

export default SettingsController;
