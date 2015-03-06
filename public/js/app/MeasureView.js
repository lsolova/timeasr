﻿"use strict";
define(['tu', 'du', 'vw', 'cm'], function (TimeUtils, DomUtils, View, common) {

    var monthE,
        statTimeE,
        dayCountE,
        prevDayE,
        actualDayE,
        nextDayE,
        counterContainerE,
        counterE,
        leaveE,
        leaveData,
        leaveChangeTimeoutId,
        currentLeaveCount = 0;

    var bindViewElements = function () {
        monthE = document.getElementById('month');
        statTimeE = document.getElementById('stattime');
        dayCountE = document.getElementById('daycount');
        prevDayE = document.getElementById('prevDay');
        actualDayE = document.getElementById('actlDay');
        nextDayE = document.getElementById('nextDay');
        counterContainerE = document.getElementById('counter');
        counterE = document.getElementById('counterValue');
        leaveE = document.getElementById('leaveValue');

        prevDayE.addEventListener('click', function () {
            common.eventBus.publish('click:day', {change: -1});
        });
        nextDayE.addEventListener('click', function () {
            common.eventBus.publish('click:day', {change: 1});
        });
        counterE.addEventListener('click', function () {
            common.eventBus.publish('click:startstop', {});
        });
        statTimeE.addEventListener('click', function () {
            common.eventBus.publish('click:stat', {});
        });
        document.addEventListener('visibilitychange', function () {
            common.eventBus.publish('change:visibility', {change: document.hidden});
        });
    };

    var changeLeave = function () {
        var cLeave;
        if (leaveData.length <= currentLeaveCount) {
            currentLeaveCount = 0;
        }
        if (leaveChangeTimeoutId) {
            window.clearTimeout(leaveChangeTimeoutId);
        }
        cLeave = leaveData[currentLeaveCount];
        DomUtils.removeClasses(leaveE, ['l-bef', 't-bef']);
        leaveE.classList.add(cLeave.type + '-bef');
        if (typeof cLeave.value === 'number') {
            DomUtils.clearAndFill(leaveE, TimeUtils.asHoursAndMinutes(cLeave.value));
        }else{
            DomUtils.clearAndFill(leaveE, cLeave.value);
        }
        currentLeaveCount++;
        if (!document.hidden) {
            leaveChangeTimeoutId = window.setTimeout(changeLeave, 5000);
        }
    };

    var MeasureView = function (viewDomElemId, controllerObj) {
        View.call(this, viewDomElemId, controllerObj, bindViewElements);
        return this;
    };
    common.inherit(MeasureView, View);

    MeasureView.prototype.update = function (data) {
        var statTimeValue = TimeUtils.asHoursAndMinutes(data.avgTime),
            isAvgTimeNonNegativ = data.avgTime >= 0,
            isTimeTypeDiff = data.timeType === this.controller.STAT.DIFF;
        DomUtils.clearAndFill(monthE, data.measureTime.getYearAndMonth());
        DomUtils.clearAndFill(statTimeE, (isTimeTypeDiff && isAvgTimeNonNegativ) ? "+" + statTimeValue : statTimeValue);
        DomUtils.clearAndFill(dayCountE, data.dayCount);
        if (isTimeTypeDiff) {
            dayCountE.classList.add(isAvgTimeNonNegativ ? 'more' : 'less');
        }else{
            DomUtils.removeClasses(dayCountE, ['less', 'more']);
        }
        DomUtils.clearAndFill(prevDayE, data.days.yesterday);
        DomUtils.clearAndFill(actualDayE, data.days.today);
        DomUtils.clearAndFill(nextDayE, data.days.tomorrow);
        leaveData = data.leave;
        changeLeave();
        DomUtils.clearAndFill(counterE, TimeUtils.asHoursAndMinutes(data.measureTime.getMinutes() + data.measuringMinutes));
        counterE.setAttribute('class', this.controller.isMeasuringInProgress() ? 'running' : 'paused');
    };

    return MeasureView;
});