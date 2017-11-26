'use strict';

import * as domUtils from '../utils/dom';
import * as TimeUtils from 'scripts/utils/timeConversion';
import View from './View';

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
        dailyWlInputE.addEventListener('change', () => {
            this.controller.setDailyWorkload(dailyWlInputE.value);
        });
        monthlyWlAdjInputE.addEventListener('keypress', adjustTextAreaHeight);
        monthlyWlAdjInputE.addEventListener('focus', function () {
           monthlyWlAdjInputE.setSelectionRange(0,0);
        });
        monthlyWlAdjInputE.addEventListener('change', () => {
            this.controller.setMonthlyAdjustment(monthlyWlAdjInputE.value);
        });
    };

    SettingsView = function (viewDomElemId, controllerObj) {
        let viewInstance = new View(viewDomElemId, controllerObj, bindViewElements);
        viewInstance.update = update;
        controllerObj.changeVisibility();
        return viewInstance;
    };

    function update(data) {
        domUtils.clearAndFill.call(monthLabelE, data.month);
        dailyWlInputE.value = TimeUtils.asHoursAndMinutes(data.dailyWorkload);
        monthlyWlAdjInputE.value = data.monthlyAdjustmentDetails;
        adjustTextAreaHeight();
        domUtils.clearAndFill.call(monthlyWlAdjSumE, TimeUtils.asHoursAndMinutes(data.monthlyAdjustment));
    }

export default SettingsView;
