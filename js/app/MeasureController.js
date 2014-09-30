"use strict";
define(['ms', 'tu'], function (MeasureStorage, TimeUtils) {
    var measureView,
        measureStorage = new MeasureStorage(),
        actualDay = measureStorage.getTimeOfDay(TimeUtils.asDay(Date.now())),
        measuring = false,
        statChangeTimeoutId,
        updateOnMeasureIntervalId,
        STAT = { AVG: {name: 'average'}, DIFF: {name: 'difference'}},
        statState = STAT.AVG
        ;

    var calculateStatistics = function(day, loopCalculation, postCalculation) {
        var dayCount = 0,
            statTime = 0,
            measuredTime
            ;
        for (var i = 1; i < day.getDay(); i++) {
            measuredTime = measureStorage.getTimeOfDay(day.getFullDay().substring(0, 6) + TimeUtils.extend(i));
            if (0 < measuredTime.getMinutes()) {
                statTime += loopCalculation(measuredTime);
                dayCount++;
            }
        }
        return dayCount === 0
            ? { statValue: 0, statCount: 0 }
            : { statValue: postCalculation(statTime, dayCount), statCount: dayCount };
    };

    var calculateMonthlyAverageForDay = function (day) {
        return calculateStatistics(day
            , function(measuredTime) {
                return measuredTime.getMinutes();
            }
            , function(statTime, dayCount) {
                return Math.floor(statTime / dayCount);
            }
        );
    };

    var calculateMonthlyDifferenceForDay = function (day) {
        var expectedDayTime = 510;
        return calculateStatistics( day
            , function(measuredTime) {
                return measuredTime.getMinutes() - expectedDayTime;
            }
            , function(statTime) {
                return statTime;
            }
        );
    };

    function getStartOn() {
        return measureStorage.get('startOn');
    }

    function setUpdateInterval(allow) {
        if (allow) {
            updateOnMeasureIntervalId = setInterval(function(){
                updateView();
            },60000);
        }else
        if (updateOnMeasureIntervalId) {
            clearInterval(updateOnMeasureIntervalId);
        }
    }

    function getCurrentMeasuringMinutes(startedOn, finishedOn) {
        finishedOn = finishedOn || Date.now();
        var measuringMinutes = 0;
        if (startedOn && startedOn < finishedOn) {
            measuringMinutes = Math.round((finishedOn - startedOn) / 60000);
        }
        return  measuringMinutes;
    }

    function updateView() {
        var statInfo;
        if (statState === STAT.AVG ) {
            statInfo = calculateMonthlyAverageForDay(actualDay);
        } else if (statState === STAT.DIFF ) {
            statInfo = calculateMonthlyDifferenceForDay(actualDay);
        }
        measureView.update(actualDay, getCurrentMeasuringMinutes(getStartOn()), statInfo.statValue, statInfo.statCount);
    }

    var MeasureController = function () {
        var startedOn = measureStorage.get('startOn');
        measuring = !(startedOn === null || startedOn === undefined);
    };

    MeasureController.prototype.addView = function (measureViewObj) {
        measureView = measureViewObj;
        updateView();
    };

    MeasureController.prototype.changeActualDay = function (sign) {
        if (measuring) {
            throw "Measuring in progress. Please pause before day change.";
        }
        actualDay = measureStorage.getTimeOfDay(TimeUtils.siblingDay(actualDay.getFullDay(), sign));
        updateView();
    };

    MeasureController.prototype.changeStat = function() {
        switch (statState) {
            case STAT.AVG :
                statState = STAT.DIFF;
                statChangeTimeoutId = setTimeout(this.changeStat, 30000);
                break;
            default :
                statState = STAT.AVG;
                window.clearTimeout(statChangeTimeoutId);
                break;
        }
        updateView();
    };

    MeasureController.prototype.changeVisibility = function(hidden) {
        if (!hidden) {
            updateView();
        }
        setUpdateInterval(!hidden);
    };

    MeasureController.prototype.startStopCounter = function () {
        if (!measuring && TimeUtils.asDay(Date.now()) !== actualDay.getFullDay()) {
            throw "Measuring allowed on current day only.";
        }
        var startedOn = getStartOn();
        if (!measuring) {
            startedOn = Date.now();
            measureStorage.set('startOn', startedOn);
            measuring = true;
            setUpdateInterval(true);
        }
        else {
            actualDay.increment(getCurrentMeasuringMinutes(startedOn));
            measureStorage.set(actualDay.getFullDay(), actualDay.getMinutes());
            measureStorage.remove('startOn');
            measuring = false;
            setUpdateInterval(false);
        }
        updateView();
    };

    MeasureController.prototype.isMeasuringInProgress = function () {
        return measuring;
    };

    return MeasureController;
});