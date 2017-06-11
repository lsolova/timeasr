'use strict';

import Controller from './Controller';
import { asMinutes, asMonth } from '../utils/timeConversion';
import { now } from '../utils/dateWrapper';
import { calculateMonthlyAdjustmentFromDetails } from '../utils/timeCalculation';

var     currentMonth,
        dailyWorkload,
        monthlyAdjustment,
        monthlyAdjustmentDetails;

let controllerInstance,
    modelHandler;

    function loadData(actualMonth) {
        dailyWorkload = modelHandler.getDailyWorkload(actualMonth);
        monthlyAdjustmentDetails = modelHandler.getMonthlyAdjustment(actualMonth);
        monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
    }

    function createViewModel() {
        var actualMonth = modelHandler.getActualDay().getYearAndMonth('');
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

    export default function SettingsController(modelH) {
        controllerInstance = new Controller();
        modelHandler = modelH;
        currentMonth = asMonth(now());
        loadData(currentMonth);
        Object.assign(controllerInstance, {
            setDailyWorkload,
            setMonthlyAdjustment,
            changeVisibility
        });
        return controllerInstance;
    }

    function setDailyWorkload(change) {
        dailyWorkload = asMinutes(change);
        modelHandler.setDailyWorkload(currentMonth, dailyWorkload);
        controllerInstance.updateView(createViewModel());
    }

    function setMonthlyAdjustment(monthlyAdjustmentDetails) {
        monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(monthlyAdjustmentDetails);
        modelHandler.setMonthlyAdjustment(currentMonth, monthlyAdjustmentDetails);
        controllerInstance.updateView(createViewModel());
    }

    function changeVisibility(hidden) {
        if (!hidden) {
            controllerInstance.updateView(createViewModel());
        }
    }
