import React, { useEffect, useState } from 'react';
import { Day, ONE_MINUTE_MILLISECS, TimelogEntry } from '../interfaces';
import { asHoursAndMinutes, dayStart, siblingDay } from '../logic/time-conversion';
import { useSelectedDay } from '../state/use-selected-day';
import { useSettings } from '../state/use-settings';
import { useDayInfo } from '../state/use-day-info';
import { now } from '../logic/browser-wrapper';
import Notification from './notification';
import { useMonthInfo } from '../state/use-month-info';
import LeaveValue from './leave-value';
import { estimateLeavingTime } from '../logic/time-calculation';

const calculateRunningCounter = (runningItem: TimelogEntry): number => runningItem ? Math.floor((now() - runningItem.startTime) / ONE_MINUTE_MILLISECS) : 0;

function MeasureView() {
    const [counter, setCounter] = useState(0);
    const [leaving, setLeaving] = useState({
        byCumulated: 0,
        bySelectedDay: 0,
    });
    const [running, setRunning] = useState<TimelogEntry>(null);
    const { settings } = useSettings();
    const { selectedDay, selectedMonth, setSelectedDay } = useSelectedDay();
    const { start, stop, dayInfo, timelog } = useDayInfo(selectedDay);
    const { workDaysCount, workMinutesDiff } = useMonthInfo(selectedDay, settings.dailyWorkload);
    const yesterday = siblingDay(selectedDay, -1);
    const tomorrow = siblingDay(selectedDay, 1);
    const runningItem = timelog.find((timelogEntry) => timelogEntry.endTime === null);
    const lastChange = timelog.reduce((lastChangeTime, timelogEntry) => {
        return Math.max(lastChangeTime, timelogEntry.startTime, timelogEntry.endTime);
    }, dayStart(now()));
    useEffect(() => {
        let tickInterval = null;
        const stopMeasure = () => {
            clearInterval(tickInterval);
            tickInterval = null;
        };
        if (running !== null) {
            const loggedMinutes = Math.floor(dayInfo.loggedMinutes || 0);
            tickInterval = setInterval(() => {
                const counterValue = loggedMinutes + calculateRunningCounter(running);
                setCounter(counterValue);
                setLeaving({
                    bySelectedDay: estimateLeavingTime(counterValue, 0, settings.dailyWorkload),
                    byCumulated: estimateLeavingTime(counterValue, workMinutesDiff, settings.dailyWorkload),
                });
            }, ONE_MINUTE_MILLISECS);
        } else if (tickInterval) {
            stopMeasure();
        }
        return stopMeasure;
    }, [running]);

    useEffect(() => {
        const loggedMinutes = Math.floor(dayInfo.loggedMinutes || 0);
        if (runningItem) {
            setRunning(runningItem);
        }
        setCounter(loggedMinutes + calculateRunningCounter(runningItem));
    }, [dayInfo, runningItem]);

    const onStartStopClick = (taskType: string) => {
        const shouldStart = running === null || taskType !== null && running.task !== taskType;
        if (shouldStart) {
            if (running) {
                stop(running);
            }
            start(taskType).then(setRunning);
        } else {
            stop(running).then(() => setRunning(null));
        }
    }

    const goToAnotherDay = (day: Day) => {
        if (!running) {
            setCounter(0);
            setSelectedDay(day);
        }
    }

    return (
        <div id="measure" className="view">
            <div id="topNavBar">
                <div id="summaryToolbar">
                    <span id="month">{selectedMonth}</span>
                    <span id="stattime">{asHoursAndMinutes(workMinutesDiff)}</span>
                    <span id="daycount">{workDaysCount}</span>
                </div>
                <div id="daySelector">
                    <div id="prevDay" className="day" onClick={() => {
                        goToAnotherDay(yesterday);
                    }}>{yesterday.substr(6)}</div>
                    <div id="actlDay" className="day actl">{selectedDay.substr(6)}</div>
                    <div id="nextDay" className="day" onClick={() => {
                        goToAnotherDay(tomorrow);
                    }}>{tomorrow.substr(6)}</div>
                </div>
            </div>
            {dayInfo === null
                ? null
                : (
                <div id="counter" className={running?'running':'paused'}>
                    <div id="counterValue" onClick={() => onStartStopClick(null)}>{asHoursAndMinutes(counter)}</div>
                    <div id="app-root">
                        <div id="taskTypesList">
                            {settings.taskTypes.map((taskType) => taskType ? (
                                    <div key={taskType} onClick={() => onStartStopClick(taskType)} className={running?.task === taskType?'sel':''}>
                                        <span>{taskType}</span>
                                        <span>-</span>
                                    </div>
                                ) : null)}
                        </div>
                    </div>
                    <div id="lastChangeTime">{new Date(lastChange).toTimeString()}</div>
                    <LeaveValue bySelectedDay={leaving.bySelectedDay} byCumulated={leaving.byCumulated} />
                </div>
                )}
            <Notification content={running?'started':'paused'} />
        </div>
    );
}

export default MeasureView;
