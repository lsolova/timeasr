"use strict";
define(['ms', 'tu'], function (MeasureStorage, TimeUtils) {
    var measureView,
        measureStorage = new MeasureStorage(),
        actualDay = measureStorage.getTime(TimeUtils.asDay(Date.now())),
        measuring = false,
        STAT = { AVG: {name: 'average'}, DIFF: {name: 'difference'}},
        statState = STAT.AVG
        ;

    var calculateStatistics = function(day, loopCalculation, postCalculation) {
        var dayCount = 0,
            statTime = 0,
            measuredTime
            ;
        for (var i = 1; i < day.getDay(); i++) {
            measuredTime = measureStorage.getTime(day.getFullDay().substring(0, 6) + TimeUtils.extend(i));
            if (0 < measuredTime.getMinutes()) {
                statTime += loopCalculation(measuredTime);
                dayCount++;
            }
        }
        return dayCount === 0 ? { statValue: 0, statCount: 0 } : { statValue: postCalculation(statTime, dayCount), statCount: dayCount };
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

    var updateView = function () {
        var statInfo;
        if (statState === STAT.AVG ) {
            statInfo = calculateMonthlyAverageForDay(actualDay);
        } else if (statState === STAT.DIFF ) {
            statInfo = calculateMonthlyDifferenceForDay(actualDay);
        }
        measureView.update(actualDay, TimeUtils.asHoursAndMinutes(statInfo.statValue), statInfo.statCount);
    };

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
        actualDay = measureStorage.getTime(TimeUtils.siblingDay(actualDay.getFullDay(), sign));
        updateView();
    };

    MeasureController.prototype.changeStat = function() {
        switch (statState) {
            case STAT.AVG :
                statState = STAT.DIFF;
                setTimeout(this.changeStat, 30000);
                break;
            default :
                statState = STAT.AVG;
                break;
        }
        updateView();
    };

    MeasureController.prototype.startStopCounter = function () {
        if (!measuring && TimeUtils.asDay(Date.now()) !== actualDay.getFullDay())
            throw "Measuring allowed on current day only.";
        var startedOn = measureStorage.get('startOn');
        if (!startedOn) {
            startedOn = Date.now();
            measureStorage.set('startOn', startedOn);
            measuring = true;
        }
        else {
            var finishedOn = Date.now();
            actualDay.increment(Math.round((finishedOn - startedOn) / 60000));
            measureStorage.set(actualDay.getFullDay(), actualDay.getRecordTime());
            measureStorage.remove('startOn');
            measuring = false;
        }
        console.log('Measure in progress: ' + measuring);
        updateView();
    };

    MeasureController.prototype.isMeasuringInProgress = function () {
        return measuring;
    };

    return MeasureController;
});