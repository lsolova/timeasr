"use strict";
define(['ms', 'tu', 'ct', 'cm'], function (MeasureStorage, TimeUtils, Controller, common) {
    var measureStorage = new MeasureStorage(),
        now = Date.now(),
        actualDay = measureStorage.getTimeOfDay(TimeUtils.asDay(now)),
        measuring = false,
        statChangeTimeoutId,
        updateOnMeasureIntervalId,
        STAT = { AVG: {name: 'average'}, DIFF: {name: 'difference'}},
        statDefaultState = STAT.DIFF,
        statState = statDefaultState,
        expectedDayTime = measureStorage.getDailyWorkload(TimeUtils.asMonth(now)),
        monthlyAdjustment = measureStorage.getMonthlyAdjustment(TimeUtils.asMonth(now)),
        self
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
        return { statValue: postCalculation(statTime, dayCount), statCount: dayCount };
    };

    var calculateMonthlyAverageForDay = function (day) {
        return calculateStatistics(day
            , function(measuredTime) {
                return measuredTime.getMinutes();
            }
            , function(statTime, dayCount) {
                return dayCount === 0 ? 0 : Math.floor((statTime + monthlyAdjustment) / dayCount);
            }
        );
    };

    var calculateMonthlyDifferenceForDay = function (day) {
        return calculateStatistics( day
            , function(measuredTime) {
                return measuredTime.getMinutes() - expectedDayTime;
            }
            , function(statTime) {
                return statTime + monthlyAdjustment;
            }
        );
    };

    var calculateEstimatedLeavingTime = function (dailyTime, differenceTime) {
        var leavingTime,
            calcTime;
        if (typeof dailyTime === 'number' && typeof differenceTime === 'number'
                && dailyTime >= 0) {
            calcTime = expectedDayTime - (dailyTime + differenceTime);
            if (calcTime > 0) {
                leavingTime = TimeUtils.getMinutesInDay(new Date()) + calcTime;
            }
        }
        return leavingTime;
    };

    function setUpdateInterval(allow) {
        if (allow) {
            updateOnMeasureIntervalId = setInterval(function(){
                createViewModel();
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

    function createViewModel() {
        var statInfo,
            actualDiff = calculateMonthlyDifferenceForDay(actualDay),
            currentMeasuringMinutes = getCurrentMeasuringMinutes(measureStorage.get('startOn')),
            fullActualDay = actualDay.getFullDay();

        switch (statState) {
            case STAT.AVG :
                statInfo = calculateMonthlyAverageForDay(actualDay);
                break;
            case STAT.DIFF :
                statInfo = actualDiff;
                break;
        }

        return {
            measureTime: actualDay,
            days: {
                yesterday: TimeUtils.siblingDay(fullActualDay, -1).substring(6),
                today: fullActualDay.substring(6),
                tomorrow: TimeUtils.siblingDay(fullActualDay, 1).substring(6)
            },
            leave: [
                {
                    type: 't',
                    value: calculateEstimatedLeavingTime(actualDay.getMinutes() + currentMeasuringMinutes, 0) % 1440 || 'now'
                },
                {
                    type: 'l',
                    value: calculateEstimatedLeavingTime(actualDay.getMinutes() + currentMeasuringMinutes, actualDiff.statValue + monthlyAdjustment) % 1440 || 'now'
                }
            ],
            measuringMinutes: currentMeasuringMinutes,
            avgTime: statInfo.statValue,
            dayCount: statInfo.statCount,
            timeType: statState
        };
    }

    var MeasureController = function () {
        Controller.call(this);
        var startedOn = measureStorage.get('startOn');
        self = this;
        measuring = !(startedOn === null || startedOn === undefined);
        common.eventBus.subscribe('click:day', this.changeActualDay);
        common.eventBus.subscribe('click:startstop', this.startStopCounter);
        common.eventBus.subscribe('click:stat', this.changeStat);
        common.eventBus.subscribe('change:visibility', this.changeVisibility);
        return this;
    };

    common.inherit(MeasureController, Controller);

    MeasureController.prototype.STAT = STAT;

    MeasureController.prototype.changeActualDay = function (sign) {
        if (measuring) {
            return;
        }
        actualDay = measureStorage.getTimeOfDay(TimeUtils.siblingDay(actualDay.getFullDay(), sign.change));
        self.updateView(createViewModel());
    };

    MeasureController.prototype.changeStat = function() {
        switch (statState) {
            case STAT.AVG :
                statState = STAT.DIFF;
                break;
            default :
                statState = STAT.AVG;
                break;
        }
        if (statState === statDefaultState) {
            window.clearTimeout(statChangeTimeoutId);
        } else {
            statChangeTimeoutId = setTimeout(self.changeStat, 30000);
        }
        self.updateView(createViewModel());
    };

    MeasureController.prototype.changeVisibility = function(hidden) {
        if ((!hidden.source || hidden.source === 'measure') && !hidden.change) {
            // Temporary update - later removeable
            expectedDayTime = measureStorage.getDailyWorkload(TimeUtils.asMonth(now));
            monthlyAdjustment = measureStorage.getMonthlyAdjustment(TimeUtils.asMonth(now));
            self.updateView(createViewModel());
        }
        setUpdateInterval(!hidden.change);
    };

    MeasureController.prototype.startStopCounter = function () {
        if (!measuring && TimeUtils.asDay(Date.now()) !== actualDay.getFullDay()) {
            return; // Do nothing
        }
        var startedOn = measureStorage.get('startOn');
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
        self.updateView(createViewModel());
    };

    MeasureController.prototype.isMeasuringInProgress = function () {
        return measuring;
    };

    return MeasureController;
});