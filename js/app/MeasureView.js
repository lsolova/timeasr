﻿"use strict";
define(['tu', 'du'], function (TimeUtils, DomUtils) {
    var measureController,
        measureViewElement,
        monthE,
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
            try {
                measureController.changeActualDay(-1);
            } catch (e) {
                alert(e);
            }
        });
        nextDayE.addEventListener('click', function () {
            try {
                measureController.changeActualDay(1);
            } catch (e) {
                alert(e);
            }
        });
        counterE.addEventListener('click', function () {
            try {
                measureController.startStopCounter();
            } catch (e) {
                alert(e);
            }
        });
        statTimeE.addEventListener('click', function () {
            try {
                measureController.changeStat();
            } catch (e) {
                alert(e);
            }
        });
        document.addEventListener('visibilitychange', function () {
            measureController.changeVisibility(document.hidden);
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

    var MeasureView = function (measureViewDiv, measureControllerObj) {
        measureViewElement = document.getElementById(measureViewDiv);
        measureController = measureControllerObj;
        bindViewElements();
        measureController.addView(this);
    };

    MeasureView.prototype.update = function (data) {
        var statTimeValue = TimeUtils.asHoursAndMinutes(data.avgTime),
            isAvgTimeNonNegativ = data.avgTime >= 0,
            isTimeTypeDiff = data.timeType === measureController.STAT.DIFF;
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
        counterE.setAttribute('class', measureController.isMeasuringInProgress() ? 'running' : 'paused');
    };

    return MeasureView;
});