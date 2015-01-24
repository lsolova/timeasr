"use strict";
define(['tu'], function (TimeUtils) {
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
        leaveE;

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
        statTimeE.addEventListener('click', function(){
            try {
                measureController.changeStat();
            } catch (e) {
                alert(e);
            }
        });
        document.addEventListener('visibilitychange', function(){
            measureController.changeVisibility(document.hidden);
        });
    };

    var clearAndFill = function (element, content) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(document.createTextNode(content));
    };

    var MeasureView = function (measureViewDiv, measureControllerObj) {
        measureViewElement = document.getElementById(measureViewDiv);
        measureController = measureControllerObj;
        bindViewElements();
        measureController.addView(this);
    };

    MeasureView.prototype.update = function (data) {
        var actlDay = data.measureTime.getFullDay().substring(6),
            prevDay = TimeUtils.siblingDay(data.measureTime.getFullDay(), -1),
            nextDay = TimeUtils.siblingDay(data.measureTime.getFullDay(), 1),
            statTimeValue = TimeUtils.asHoursAndMinutes(data.avgTime),
            isAvgTimeNonNegativ = data.avgTime >= 0,
            isTimeTypeDiff = data.timeType === measureController.STAT.DIFF;
        clearAndFill(monthE, data.measureTime.getYearAndMonth());
        clearAndFill(statTimeE, (isTimeTypeDiff && isAvgTimeNonNegativ) ? "+" + statTimeValue : statTimeValue);
        clearAndFill(dayCountE, data.dayCount);
        if (isTimeTypeDiff) {
            if (isAvgTimeNonNegativ) {
                dayCountE.classList.add('more');
            }else{
                dayCountE.classList.add('less');
            }
        }else{
            dayCountE.classList.remove('more');
            dayCountE.classList.remove('less');
        }
        clearAndFill(prevDayE, prevDay.substring(6));
        clearAndFill(actualDayE, actlDay);
        clearAndFill(nextDayE, nextDay.substring(6));
        clearAndFill(leaveE, 'leave ' + (data.leaveTime > 0 ? 'at ' + TimeUtils.asHoursAndMinutes(data.leaveTime) : 'now'));
        clearAndFill(counterE, TimeUtils.asHoursAndMinutes(data.measureTime.getMinutes() + data.measuringMinutes));
        if (measureController.isMeasuringInProgress()) {
            counterE.setAttribute('class', 'running');
        }
        else {
            counterE.setAttribute('class', 'paused');
        }
    };

    return MeasureView;
});