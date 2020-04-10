import { calculateMonthlyAdjustmentFromDetails, calculateMonthlyDifference, estimateLeavingTime } from '../utils/timeCalculation';
import { createTimeLogEntry, getLastChangeTime, getTodayDetails } from 'scripts/services/timeLogService';
import { now } from '../utils/dateWrapper';
import * as timeConversionUtils from 'scripts/utils/timeConversion';
import Controller from './Controller';
import ModelHandler from './ModelHandler';

let controllerInstance;
let lastChangeTimeString;
let dayDetails;

var modelHandler = new ModelHandler(),
        MeasureController,
        nowInMillis = now(),
        measureInProgress = false,
        updateOnMeasureIntervalId,
        expectedDayTime = modelHandler.getDailyWorkload(timeConversionUtils.asMonth(nowInMillis)),
        monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(
                modelHandler.getMonthlyAdjustment(timeConversionUtils.asMonth(nowInMillis)
            ));

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

    function createViewModel(nowStarted) {
        var actualDay = modelHandler.getActualDay(),
            actualDiff = calculateMonthlyDifference(
                modelHandler.getMonthlyMeasuredTimes(actualDay), monthlyAdjustment, expectedDayTime
            ),
            currentMeasuringMinutes = modelHandler.getCurrentMeasuringMinutes(),
            fullActualDay = actualDay.getFullDay()
            ;

        const viewModel = {
            measureTime: actualDay,
            days: {
                yesterday: timeConversionUtils.siblingDay(fullActualDay, -1).substring(6),
                today: fullActualDay.substring(6),
                tomorrow: timeConversionUtils.siblingDay(fullActualDay, 1).substring(6)
            },
            leave: [
                {
                    type: 't',
                    value: timeConversionUtils.asHoursAndMinutes(estimateLeavingTime(
                        actualDay.getMinutes() + currentMeasuringMinutes, 0, expectedDayTime
                    ) % 1440) || 'now'
                },
                {
                    type: 'l',
                    value: timeConversionUtils.asHoursAndMinutes(estimateLeavingTime(
                        actualDay.getMinutes() + currentMeasuringMinutes, actualDiff.statValue, expectedDayTime
                    ) % 1440) || 'now'
                }
            ],
            measuringMinutes: currentMeasuringMinutes,
            actualMinutes: timeConversionUtils.asHoursAndMinutes(actualDay.getMinutes() + currentMeasuringMinutes),
            avgTime: timeConversionUtils.asHoursAndMinutes(actualDiff.statValue),
            dayCount: actualDiff.statCount,
            isInProgress: measureInProgress,
            lastChangeTime: lastChangeTimeString ? new Date(lastChangeTimeString).toISOString() : '',
            taskTypes: dayDetails || modelHandler.getTaskTypes(),
            nowStarted: nowStarted
        };
        return viewModel;
    }

    MeasureController = function () {
        var startedOn = modelHandler.lastStartTime();
        controllerInstance = new Controller();
        measureInProgress = !(startedOn === null || startedOn === undefined);
        Object.assign(controllerInstance, {
            changeToPreviousDay,
            changeToNextDay,
            changeVisibility,
            startOrStop,
            changeToTaskType
        });
        getLastChangeTime().then((lastChangeTime) => {
            lastChangeTimeString = lastChangeTime || '';
            controllerInstance.updateView(createViewModel());
        });
        updateDayDetails()
            .then(() => {
                controllerInstance.updateView(createViewModel());
            });
        return controllerInstance;
    };

    function updateDayDetails() {
        return getTodayDetails().then((dayDetailsResult) => {
            const taskTypes = modelHandler.getTaskTypes();
            dayDetails = taskTypes.map((taskType) => {
                return {
                    name: taskType,
                    time: dayDetailsResult[taskType] || 0
                }
            });
        });
    }

    function changeActualDay(sign) {
        if (measureInProgress) {
            return;
        }
        modelHandler.setActualDay(sign);
        controllerInstance.updateView(createViewModel());
    }

    function changeToPreviousDay() {
        changeActualDay(-1);
    }

    function changeToNextDay() {
        changeActualDay(1);
    }

    function changeVisibility(hidden) {
        if (!hidden) {
            // Temporary update - later removeable
            expectedDayTime = modelHandler.getDailyWorkload(timeConversionUtils.asMonth(nowInMillis));
            monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(
                modelHandler.getMonthlyAdjustment(timeConversionUtils.asMonth(nowInMillis))
            );
            controllerInstance.updateView(createViewModel());
        }
        setUpdateInterval(!hidden);
    }

    function start(startTime, timeLogComment) {
        if (timeConversionUtils.asDay(now()) !== modelHandler.getActualDay().getFullDay()) {
            return; // Do nothing
        }
        modelHandler.startMeasurement(startTime, timeLogComment);
        measureInProgress = true;
        setUpdateInterval(true);
        setLogRecord({
            timeLogComment: timeLogComment || ''
        }).then(() => {
            controllerInstance.updateView(createViewModel(true));
        });
    }

    function stop(stopTime) {
        modelHandler.stopMeasurement(stopTime);
        measureInProgress = false;
        setUpdateInterval(false);
        setLogRecord({})
            .then(() => {
                return updateDayDetails();
            })
            .then(() => {
                controllerInstance.updateView(createViewModel(false));
            });
    }

    function setLogRecord(timeLogContent) {
        return createTimeLogEntry(timeLogContent)
            .then((createdLogTime) => {
                lastChangeTimeString = createdLogTime;
            });
    }

    function startOrStop(timeLogComment) {
        if (!measureInProgress) {
            start(now(), timeLogComment);
        } else {
            stop();
        }
    }

    function changeToTaskType(timelogComment) {
        controllerInstance.updateView(createViewModel());
    }

export default MeasureController;
