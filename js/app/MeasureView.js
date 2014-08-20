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
        counterE;

    var bindViewElements = function () {
        monthE = document.getElementById('month');
        statTimeE = document.getElementById('stattime');
        dayCountE = document.getElementById('daycount');
        prevDayE = document.getElementById('prevDay');
        actualDayE = document.getElementById('actlDay');
        nextDayE = document.getElementById('nextDay');
        counterE = document.getElementById('counterValue');

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
            if (!document.hidden) {
                measureController.visibilityChanged();
            }
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

    MeasureView.prototype.update = function (measureTime, avgtime, daycount) {
        var actlDay = measureTime.getFullDay().substring(6),
            prevDay = TimeUtils.siblingDay(measureTime.getFullDay(), -1),
            nextDay = TimeUtils.siblingDay(measureTime.getFullDay(), 1);

        clearAndFill(monthE, measureTime.getYearAndMonth());
        clearAndFill(statTimeE, avgtime);
        clearAndFill(dayCountE, daycount);
        clearAndFill(prevDayE, prevDay.substring(6));
        clearAndFill(actualDayE, actlDay);
        clearAndFill(nextDayE, nextDay.substring(6));
        clearAndFill(counterE, measureTime.getTime());
        if (measureController.isMeasuringInProgress()) {
            counterE.setAttribute('class', 'running');
        }
        else {
            counterE.setAttribute('class', 'paused');
        }
    };

    return MeasureView;
});