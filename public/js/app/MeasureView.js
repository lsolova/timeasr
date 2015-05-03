"use strict";
define(['tu', 'du', 'vw', 'cm'], function (TimeUtils, DomUtils, View, common) {

    var monthE,
        statTimeE,
        dayCountE,
        prevDayE,
        actualDayE,
        nextDayE,
        counterContainerE,
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
        counterContainerE = document.getElementById('counter');
        counterE = document.getElementById('counterValue');
        leaveE = document.getElementById('leaveValue');
        notificationE = document.getElementById('notification');

        prevDayE.addEventListener('click', function () {
            common.eventBus.publish('click:day', {change: -1});
        });
        nextDayE.addEventListener('click', function () {
            common.eventBus.publish('click:day', {change: 1});
        });
        counterE.addEventListener('click', function () {
            common.eventBus.publish('click:startstop', {});
        });
        statTimeE.addEventListener('click', function () {
            common.eventBus.publish('click:stat', {});
        });
        document.addEventListener('visibilitychange', function () {
            common.eventBus.publish('change:visibility', {change: document.hidden});
        });
    };

    var showNotification = function (content) {
        DomUtils.clearAndFill(notificationE, content);
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

        DomUtils.removeClasses(leaveE, ['l-bef', 't-bef', 'hidden']);
        cLeave = leaveData[currentLeaveCount];
        leaveE.classList.add(cLeave.type + '-bef');
        if (isHidden) {
            leaveE.classList.add('hidden');
        } else {
            if (typeof cLeave.value === 'number') {
                DomUtils.clearAndFill(leaveE, TimeUtils.asHoursAndMinutes(cLeave.value));
            }else{
                DomUtils.clearAndFill(leaveE, cLeave.value);
            }
            currentLeaveCount++;
            if (!document.hidden) {
                leaveChangeTimeoutId = window.setTimeout(changeLeave, 5000);
            }
        }
    };

    var MeasureView = function (viewDomElemId, controllerObj) {
        View.call(this, viewDomElemId, controllerObj, bindViewElements);
        return this;
    };
    common.inherit(MeasureView, View);

    MeasureView.prototype.update = function (data) {
        var statTimeValue = TimeUtils.asHoursAndMinutes(data.avgTime),
            isAvgTimeNonNegativ = data.avgTime >= 0,
            isTimeTypeDiff = data.timeType === this.controller.STAT.DIFF;
        DomUtils.clearAndFill(monthE, data.measureTime.getYearAndMonth('/'));
        DomUtils.clearAndFill(statTimeE, (isTimeTypeDiff && isAvgTimeNonNegativ) ? "+" + statTimeValue : statTimeValue);
        DomUtils.clearAndFill(dayCountE, data.dayCount);
        DomUtils.removeClasses(dayCountE, ['less', 'more']);
        if (isTimeTypeDiff) {
            dayCountE.classList.add(isAvgTimeNonNegativ ? 'more' : 'less');
        }
        DomUtils.clearAndFill(prevDayE, data.days.yesterday);
        DomUtils.clearAndFill(actualDayE, data.days.today);
        DomUtils.clearAndFill(nextDayE, data.days.tomorrow);
        leaveData = data.leave;
        changeLeave(!this.controller.isMeasuringInProgress());
        DomUtils.clearAndFill(counterE, TimeUtils.asHoursAndMinutes(data.measureTime.getMinutes() + data.measuringMinutes));
        counterE.setAttribute('class', this.controller.isMeasuringInProgress() ? 'running' : 'paused');
        if (data.nowStarted) {
            showNotification('Started');
        } else
        if (data.nowStarted === false ){
            showNotification('Paused');
        }
    };

    return MeasureView;
});