import { calculateMonthlyAdjustmentFromDetails, calculateMonthlyDifference, estimateLeavingTime } from '../utils/timeCalculation';
import { getLastChangeTime, getTodayDetails } from 'scripts/services/timeLogService';
import { LOGTYPE_START, LOGTYPE_STOP } from '../../../scripts/services/timeLogDefinitions';
import { now } from 'scripts/utils/dateUtils';
import * as timeConversionUtils from 'scripts/utils/timeConversion';
import Controller from './Controller';
import ModelHandler from './ModelHandler';

const SHADOW_CLICK_DELAY = 2000; // 2 seconds

let controllerInstance;
let dayDetails;
let lastChangeTimeString;
let modelHandler;

var     MeasureController,
        nowInMillis = now(),
        isMeasureRunning = false,
        isChangeCalled = false,
        measureUpdateIntervalId,
        expectedDayTime,
        monthlyAdjustment;

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

    MeasureController = function (initialModelHandler) {
        controllerInstance = new Controller();
        modelHandler = initialModelHandler;

        var lastStartTimeValue = modelHandler.lastStartTime();
        expectedDayTime = modelHandler.getDailyWorkload(timeConversionUtils.asMonth(nowInMillis));
        monthlyAdjustment = calculateMonthlyAdjustmentFromDetails(
            modelHandler.getMonthlyAdjustment(timeConversionUtils.asMonth(nowInMillis))
        );
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
                const mappedDayDetails = {
                    name: taskType,
                    time: dayDetailsResult.result[taskType] || 0
                };
                if (taskType === dayDetailsResult.lastTaskType) {
                    mappedDayDetails.selected = true;
                }
                return mappedDayDetails;
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
            updateDayDetails()
                .then(() => {
                    controllerInstance.updateView(createViewModel());
                });
        }
        setUpdateInterval(!hidden);
    }

    function start(startTime, timeLogComment) {
        if (timeConversionUtils.asDay(now()) !== modelHandler.getActualDay().getFullDay()) {
            return Promise.resolve(); // Do nothing
        }
        return modelHandler.startMeasurement(startTime, timeLogComment)
            .then((createdLogTime) => {
                isMeasureRunning = true;
                setUpdateInterval(true);
                lastChangeTimeString = createdLogTime;
                return updateDayDetails();
            }).then(() => {
                controllerInstance.updateView(createViewModel(LOGTYPE_START));
            });
    }

    function stop(stopTime) {
        return modelHandler.stopMeasurement(stopTime)
            .then((createdLogTime) => {
                isMeasureRunning = false;
                setUpdateInterval(false);
                lastChangeTimeString = createdLogTime;
                return updateDayDetails();
            })
            .then(() => {
                controllerInstance.updateView(createViewModel(LOGTYPE_STOP));
            });
    }

    function startOrStop(timeLogComment) {
        if(isChangeCalled) {
            return;
        }
        isChangeCalled = true;
        setTimeout(() => {
            isChangeCalled = false;
        }, SHADOW_CLICK_DELAY);
        if (isMeasureRunning) {
            stop();
        } else {
            start(now(), timeLogComment);
        }
    }

    function changeToTaskType(timeLogComment) {
        Promise.resolve()
            .then(() => {
                if (isMeasureRunning) {
                    return stop();
                }
            })
            .then(() => {
                start(now(), timeLogComment);
            });
    }

export default MeasureController;
