"use strict";
define(['ms', 'tu'], function (MeasureStorage, TimeUtils) {
    var measureView,
        measureStorage = new MeasureStorage(),
        actualDay = measureStorage.getTime(TimeUtils.asDay(Date.now())),
        measuring = false,
        STAT = { AVG: {name: 'average'}, DIFF: {name: 'difference'}},
        statState = STAT.AVG
        ;

    var calculateMonthlyAverageForDay = function (day) {
        var daycount = 0,
            fulltime = 0,
            measuredTime
            ;
        for (var i = 1; i < day.getDay(); i++) {
            measuredTime = measureStorage.getTime(day.getFullDay().substr(0, 6) + TimeUtils.extend(i));
            if (0 < measuredTime.getMinutes()) {
                fulltime += (measuredTime.getMinutes());
                daycount++;
            }
        }
        return daycount === 0 ? { statValue: 0, statCount: 0 } : { statValue: Math.floor(fulltime / daycount), statCount: daycount };
    };

    var calculateMonthlyDifferenceForDay = function (day) {
        var daycount = 0,
            difftime = 0,
            expectedDayTime = 510,
            measuredTime
            ;
        for (var i = 1; i < day.getDay(); i++) {
            measuredTime = measureStorage.getTime(day.getFullDay().substr(0, 6) + TimeUtils.extend(i));
            if (0 < measuredTime.getMinutes()) {
                difftime += (measuredTime.getMinutes() - expectedDayTime);
                daycount++;
            }
        }
        return daycount === 0 ? { statValue: 0, statCount: 0 } : { statValue: difftime, statCount: daycount };
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