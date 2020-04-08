import Controller from './Controller';
import ModelHandler from './ModelHandler';
import * as timeConversionUtils from 'scripts/utils/timeConversion';
import { now } from '../utils/dateWrapper';
import { calculateMonthlyAdjustmentFromDetails,
         calculateMonthlyDifference,
         estimateLeavingTime
         } from '../utils/timeCalculation';
import { createTimeLogEntry, getTodayDetails, getLastChangeTime } from 'scripts/services/timeLogService';

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

    function getCurrentMeasuringMinutes(startedOn, finishedOn) {
        var measuringMinutes = 0;
        finishedOn = finishedOn || now();
        if (startedOn && startedOn < finishedOn) {
            measuringMinutes = Math.round((finishedOn - startedOn) / 60000);
        }
        return  measuringMinutes;
    }

    function createViewModel() {
        var actualDay = modelHandler.getActualDay(),
            actualDiff = calculateMonthlyDifference(
                modelHandler.getMonthlyMeasuredTimes(actualDay), monthlyAdjustment, expectedDayTime
            ),
            currentMeasuringMinutes = getCurrentMeasuringMinutes(modelHandler.lastStartTime()),
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
            taskTypes: dayDetails || modelHandler.getTaskTypes()
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
            startOrStop
        });
        getLastChangeTime().then((lastChangeTime) => {
            lastChangeTimeString = lastChangeTime || '';
            controllerInstance.updateView(createViewModel());
        });
        updateDayDetails();
        return controllerInstance;
    };

    function updateDayDetails() {
        getTodayDetails().then((dayDetailsResult) => {
            const taskTypes = modelHandler.getTaskTypes();
            dayDetails = taskTypes.map((taskType) => {
                return {
                    name: taskType,
                    time: dayDetailsResult[taskType] || 0
                }
            });
            controllerInstance.updateView(createViewModel());
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

    function startOrStop(timelogComment) {
        var startedOn,
            viewModel,
            isStarting = !measureInProgress;
        if (isStarting && timeConversionUtils.asDay(now()) !== modelHandler.getActualDay().getFullDay()) {
            return; // Do nothing
        }
        startedOn = modelHandler.lastStartTime();
        if (isStarting) {
            startedOn = now();
            modelHandler.lastStartTime(startedOn);
            measureInProgress = true;
            setUpdateInterval(true);
        }
        else {
            modelHandler.incrementActualDay(getCurrentMeasuringMinutes(startedOn));
            modelHandler.lastStartTime(null);
            measureInProgress = false;
            setUpdateInterval(false);
        }

        createTimeLogEntry(timelogComment || '').then((createdLogTime) => {
            lastChangeTimeString = createdLogTime;
            viewModel = createViewModel();
            viewModel.nowStarted = viewModel.isInProgress;
            if (!isStarting) {
                updateDayDetails();
            } else {
                controllerInstance.updateView(viewModel);
            }
        });
    }

export default MeasureController;
