import * as domUtils from '../utils/dom';
import { asHoursAndMinutes } from '../utils/timeConversion';
import View from './View';
import { showNotification } from './notification';

let viewInstance;

var monthE,
    statTimeE,
    dayCountE,
    prevDayE,
    actualDayE,
    nextDayE,
    counterE,
    counterContainerE,
    leaveE,
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
    counterE = document.getElementById('counterValue');
    counterContainerE = document.getElementById('counter');
    leaveE = document.getElementById('leaveValue');

    prevDayE.addEventListener('click', () => {
        this.controller.changeToPreviousDay();
    });
    nextDayE.addEventListener('click', () => {
        this.controller.changeToNextDay();
    });
    counterE.addEventListener('click', () => {
        this.controller.startOrStop();
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
        isAvgTimePositive = statTimeValue > 0,
        notificationText = data.nowStarted === true ? 'Started' : data.nowStarted === false ? 'Paused' : undefined
        ;

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

    changeLeave(!data.isInProgress, data.leave);

    domUtils.clearAndFill.call(counterE, data.actualMinutes);
    counterContainerE.setAttribute('class', data.isInProgress ? 'running' : 'paused');

    showNotification(notificationText);
}

export default MeasureView;
