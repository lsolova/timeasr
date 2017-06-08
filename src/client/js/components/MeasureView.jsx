import * as domUtils from '../utils/dom';
import View from './View';
import { showNotification } from './notification';

import React from 'react';
import ReactDOM from 'react-dom';
import RemainingTimeInfo from './react/RemainingTimeInfo.jsx';

let viewInstance;

var monthE,
    statTimeE,
    dayCountE,
    prevDayE,
    actualDayE,
    nextDayE,
    counterE
    ;

var bindViewElements = function () {
    monthE = document.getElementById('month');
    statTimeE = document.getElementById('stattime');
    dayCountE = document.getElementById('daycount');
    prevDayE = document.getElementById('prevDay');
    actualDayE = document.getElementById('actlDay');
    nextDayE = document.getElementById('nextDay');
    counterE = document.getElementById('counterValue');

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
    const values = leaveData.reduce((acc, leaveDataItem) => {
        acc[leaveDataItem.type] = leaveDataItem.value;
        return acc;
    }, {});
    ReactDOM.render(
        <RemainingTimeInfo hidden={isHidden} timeType={leaveData[0].type} timeValues={values}></RemainingTimeInfo>,
        document.getElementById('leaveValueC')
    );
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

    changeLeave(!data.nowStarted, data.leave);

    domUtils.clearAndFill.call(counterE, data.actualMinutes);
    counterE.setAttribute('class', data.nowStarted ? 'running' : 'paused');

    showNotification(notificationText);
}

export default MeasureView;
