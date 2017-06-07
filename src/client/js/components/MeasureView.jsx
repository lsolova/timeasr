import * as domUtils from '../utils/dom';
import * as eventBus from '../utils/eventBus';
import * as timeUtils from '../utils/time';
import View from './View';

let viewInstance;

var monthE,
    statTimeE,
    dayCountE,
    prevDayE,
    actualDayE,
    nextDayE,
    counterE,
    leaveE,
    notificationE,
    leaveData,
    leaveChangeTimeoutId,
    currentLeaveCount = 0;

var bindViewElements = function () {
    monthE = document.getElementById('month');
    statTimeE = document.getElementById('stattime');
    dayCountE = document.getElementById('daycount');
    prevDayE = document.getElementById('prevDay');
    actualDayE = document.getElementById('actlDay');
    nextDayE = document.getElementById('nextDay');
    counterE = document.getElementById('counterValue');
    leaveE = document.getElementById('leaveValue');
    notificationE = document.getElementById('notification');

    prevDayE.addEventListener('click', function () {
        eventBus.publish('click:day', { change: -1 });
    });
    nextDayE.addEventListener('click', function () {
        eventBus.publish('click:day', { change: 1 });
    });
    counterE.addEventListener('click', function () {
        eventBus.publish('click:startstop', {});
    });
    statTimeE.addEventListener('click', function () {
        eventBus.publish('click:stat', {});
    });
    document.addEventListener('visibilitychange', function () {
        eventBus.publish('change:visibility', { change: document.hidden });
    });
};

var showNotification = function (content) {
    domUtils.clearAndFill.call(notificationE, content);
    notificationE.classList.add('show');
    window.setTimeout(function () {
        notificationE.classList.remove('show');
    }, 2000);
};

var changeLeave = function (isHidden) {
    var cLeave;
    if (leaveData.length <= currentLeaveCount) {
        currentLeaveCount = 0;
    }
    if (leaveChangeTimeoutId) {
        window.clearTimeout(leaveChangeTimeoutId);
    }

    domUtils.removeClasses(leaveE, ['l-bef', 't-bef', 'hidden']);
    cLeave = leaveData[currentLeaveCount];
    leaveE.classList.add(cLeave.type + '-bef');
    if (isHidden) {
        leaveE.classList.add('hidden');
    } else {
        if (typeof cLeave.value === 'number') {
            domUtils.clearAndFill.call(leaveE, timeUtils.asHoursAndMinutes(cLeave.value));
        } else {
            domUtils.clearAndFill.call(leaveE, cLeave.value);
        }
        currentLeaveCount++;
        if (!document.hidden) {
            leaveChangeTimeoutId = window.setTimeout(changeLeave, 5000);
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
    const statTimeValue = timeUtils.asHoursAndMinutes(data.avgTime),
        isAvgTimeNonNegativ = data.avgTime >= 0,
        isTimeTypeDiff = data.timeType === this.controller.STAT.DIFF;
    domUtils.clearAndFill.call(monthE, data.measureTime.getYearAndMonth('/'));
    domUtils.clearAndFill.call(statTimeE, (isTimeTypeDiff && isAvgTimeNonNegativ)
        ? "+" + statTimeValue
        : statTimeValue
    );
    domUtils.clearAndFill.call(dayCountE, data.dayCount);
    domUtils.removeClasses(dayCountE, ['less', 'more']);
    if (isTimeTypeDiff) {
        dayCountE.classList.add(isAvgTimeNonNegativ ? 'more' : 'less');
    }
    domUtils.clearAndFill.call(prevDayE, data.days.yesterday);
    domUtils.clearAndFill.call(actualDayE, data.days.today);
    domUtils.clearAndFill.call(nextDayE, data.days.tomorrow);
    leaveData = data.leave;
    changeLeave(!this.controller.isMeasuringInProgress());
    domUtils.clearAndFill.call(counterE,
        timeUtils.asHoursAndMinutes(data.measureTime.getMinutes() + data.measuringMinutes));
    counterE.setAttribute('class', this.controller.isMeasuringInProgress() ? 'running' : 'paused');
    if (data.nowStarted) {
        showNotification('Started');
    } else
        if (data.nowStarted === false) {
            showNotification('Paused');
        }
}
export default MeasureView;
