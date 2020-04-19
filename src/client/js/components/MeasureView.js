import * as domUtils from '../utils/dom';
import { asHoursAndMinutes } from 'scripts/utils/timeConversion';
import View from './View';
import { showNotification } from './notification';
import { asDecimalHours } from '../../../scripts/utils/timeConversion';

let viewInstance;
let timelogComment;

var monthE,
    statTimeE,
    dayCountE,
    prevDayE,
    actualDayE,
    nextDayE,
    counterContainerE,
    counterE,
    leaveE,
    lastChangeTimeE,
    taskTypeListE,
    leaveChangeTimeoutId,
    currentLeaveCount = 0
    ;

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
    lastChangeTimeE = document.getElementById('lastChangeTime');
    taskTypeListE = document.getElementById('taskTypesList');

    prevDayE.addEventListener('click', () => {
        this.controller.changeToPreviousDay();
    });
    nextDayE.addEventListener('click', () => {
        this.controller.changeToNextDay();
    });
    counterE.addEventListener('click', () => {
        this.controller.startOrStop(timelogComment);
    });
    document.addEventListener('visibilitychange', () => {
        this.controller.changeVisibility(document.hidden);
    });
};

var rotateTimeInfo = function (isHidden, leaveData) {
    var cLeave;
    if (leaveData.length <= currentLeaveCount) {
        currentLeaveCount = 0;
    }
    if (leaveChangeTimeoutId) {
        window.clearTimeout(leaveChangeTimeoutId);
    }
    domUtils.removeClasses.call(leaveE, ['l-bef', 't-bef']);
    cLeave = leaveData[currentLeaveCount];
    leaveE.classList.add(cLeave.type + '-bef');
    if (!isHidden) {
        if (typeof cLeave.value === 'number') {
            domUtils.clearAndFill.call(leaveE, asHoursAndMinutes(cLeave.value));
        } else {
            domUtils.clearAndFill.call(leaveE, cLeave.value);
        }
        currentLeaveCount++;
        if (!document.hidden) {
            leaveChangeTimeoutId = window.setTimeout(() => rotateTimeInfo(isHidden, leaveData), 5000);
        }
    }
};

var MeasureView = function (viewDomElemId, controllerObj, vm) {
    viewInstance = new View(viewDomElemId, controllerObj, bindViewElements);
    viewInstance.update = update;
    viewInstance.vue = vm;
    vm.start = function (taskTypeName) {
        controllerObj.changeToTaskType(taskTypeName);
    };
    controllerObj.changeVisibility();
    return viewInstance;
};

function update(data) {
    const statTimeValue = data.avgTime,
        isAvgTimePositive = statTimeValue > '0:00',
        notificationText = data.notificationContent
        ;
    if (viewInstance.vue) {
        viewInstance.vue.taskTypes = data.taskTypes.filter((taskType) => {
            return taskType.name;
        }).map((taskType) => {
            return Object.assign(taskType, {
                time: asDecimalHours(taskType.time)
            });
        });
    }

    domUtils.clearAndFill.call(monthE, data.measureTime.getYearAndMonth('/'));
    domUtils.clearAndFill.call(statTimeE, (isAvgTimePositive ? '+' : '') + statTimeValue);
    domUtils.clearAndFill.call(dayCountE, data.dayCount);
    domUtils.removeClasses.call(dayCountE, ['less', 'more']);
    if (statTimeValue !== 0) {
        dayCountE.classList.add(isAvgTimePositive ? 'more' : 'less');
    }
    domUtils.clearAndFill.call(prevDayE, data.days.yesterday);
    domUtils.clearAndFill.call(actualDayE, data.days.today);
    domUtils.clearAndFill.call(nextDayE, data.days.tomorrow);

    counterContainerE.setAttribute('class', data.isMeasureRunning ? 'running' : 'paused');
    domUtils.clearAndFill.call(counterE, data.actualMinutes);
    rotateTimeInfo(!data.isMeasureRunning, data.leave);
    domUtils.clearAndFill.call(lastChangeTimeE, data.lastChangeTime);

    showNotification(notificationText);
}

export default MeasureView;
