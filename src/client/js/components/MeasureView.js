import * as domUtils from '../utils/dom';
import { asHoursAndMinutes } from 'scripts/utils/timeConversion';
import View from './View';
import { showNotification } from './notification';

let viewInstance;
let timelogComment;
let knownTaskTypes;

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
    taskTypeListE.addEventListener('click', (event) => {
        timelogComment = event.target.innerText;
        renderTaskTypes(knownTaskTypes);
    });
    document.addEventListener('visibilitychange', () => {
        this.controller.changeVisibility(document.hidden);
    });
};

var changeLeave = function (isHidden, leaveData) {
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
            leaveChangeTimeoutId = window.setTimeout(() => changeLeave(isHidden, leaveData), 5000);
        }
    }
};

var MeasureView = function (viewDomElemId, controllerObj) {
    viewInstance = new View(viewDomElemId, controllerObj, bindViewElements);
    viewInstance.update = update;
    controllerObj.changeVisibility();
    return viewInstance;
};

function update(data) {
    const statTimeValue = data.avgTime,
        isAvgTimePositive = statTimeValue > '0:00',
        notificationText = data.nowStarted === true ? 'Started' : data.nowStarted === false ? 'Paused' : undefined
        ;
    knownTaskTypes = data.taskTypes;

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

    counterContainerE.setAttribute('class', data.isInProgress ? 'running' : 'paused');
    domUtils.clearAndFill.call(counterE, data.actualMinutes);
    changeLeave(!data.isInProgress, data.leave);
    domUtils.clearAndFill.call(lastChangeTimeE, data.lastChangeTime);
    renderTaskTypes(data.taskTypes);

    showNotification(notificationText);
}

function renderTaskTypes(taskTypes) {
    domUtils.clear.call(taskTypeListE);
    taskTypes.forEach((taskType) => {
        if (taskType) {
            const taskTypeElement = document.createElement('span');
            if (taskType === timelogComment) {
                taskTypeElement.classList.add('sel');
            }
            taskTypeElement.appendChild(document.createTextNode(taskType));
            taskTypeListE.appendChild(taskTypeElement);
        }
    });
}

export default MeasureView;
