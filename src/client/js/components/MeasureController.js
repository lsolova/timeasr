import { calculateMonthlyAdjustmentFromDetails, calculateMonthlyDifference, estimateLeavingTime } from '../utils/timeCalculation';
import { getLastChangeTime, getTodayDetails } from 'scripts/services/timeLogService';
import { LOGTYPE_START, LOGTYPE_STOP } from '../../../scripts/services/timeLogDefinitions';
import { now } from 'scripts/utils/dateUtils';
import * as timeConversionUtils from 'scripts/utils/timeConversion';
import Controller from './Controller';
import ModelHandler from './ModelHandler';

let controllerInstance;
let lastChangeTimeString;
let dayDetails;

var modelHandler = new ModelHandler(),
        MeasureController,
        nowInMillis = now(),
        isMeasureRunning = false,
        measureUpdateIntervalId,
        expectedDayTime = modelHandler.getDailyWorkload(timeConversionUtils.asMonth(nowInMillis)),
        monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(
            modelHandler.getMonthlyAdjustment(timeConversionUtils.asMonth(nowInMillis))
        );

    function setUpdateInterval(allow) {
        if (allow) {
            measureUpdateIntervalId = setInterval(() => {
                createViewModel();
            },60000);
        }else
        if (measureUpdateIntervalId) {
            clearInterval(measureUpdateIntervalId);
        }
    }

    function createViewModel(logType) {
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
            isMeasureRunning,
            lastChangeTime: lastChangeTimeString ? new Date(lastChangeTimeString).toISOString() : '',
            taskTypes: dayDetails || modelHandler.getTaskTypes(),
            notificationContent: ((logTypeValue) => {
                switch (logTypeValue) {
                    case LOGTYPE_START:
                        return 'started';
                    case LOGTYPE_STOP:
                        return 'paused';
                }
            })(logType)
        };
        return viewModel;
    }

    MeasureController = function () {
        var lastStartTimeValue = modelHandler.lastStartTime();
        controllerInstance = new Controller();
        isMeasureRunning = !(lastStartTimeValue === null || lastStartTimeValue === undefined);
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
        if (isMeasureRunning) {
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
        isMeasureRunning = true;
        setUpdateInterval(true);
        setLogRecord({
            timeLogComment: timeLogComment || ''
        }).then(() => {
            controllerInstance.updateView(createViewModel(LOGTYPE_START));
        });
    }

    function stop(stopTime) {
        modelHandler.stopMeasurement(stopTime);
        isMeasureRunning = false;
        setUpdateInterval(false);
        setLogRecord({})
            .then(() => {
                return updateDayDetails();
            })
            .then(() => {
                controllerInstance.updateView(createViewModel(LOGTYPE_STOP));
            });
    }

    function setLogRecord(timeLogContent) {
        return createTimeLogEntry(timeLogContent)
            .then((createdLogTime) => {
                lastChangeTimeString = createdLogTime;
            });
    }

    function startOrStop(timeLogComment) {
        if (isMeasureRunning) {
            stop();
        } else {
            start(now(), timeLogComment);
        }
    }

    function changeToTaskType(timelogComment) {
        controllerInstance.updateView(createViewModel());
    }

export default MeasureController;
