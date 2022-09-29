import { asHoursAndMinutes, asMinutes } from '../logic/time-conversion';
import { useSelectedDay } from '../state/use-selected-day';
import { useSettings } from '../state/use-settings';
import React from 'react';

const adjustTextAreaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = element.scrollHeight + 'px';
};

export const SettingsView = ({appVersion}: { appVersion: string }) => {
    const { setDailyWorkload, setMonthlyAdjustment, setTaskTypes, settings } = useSettings();
    const { selectedMonth } = useSelectedDay();

    return (
        <div id="settings" className="view">
            <div id="topTitleBar">
                <h1>Settings <span id="dwlForMonth">{selectedMonth}</span></h1>
            </div>
            <div className="settingsrow">
                <label htmlFor="dailywl">Daily workload</label>
                <input
                    id="dailywl"
                    name="dailywl"
                    type="text"
                    value={asHoursAndMinutes(settings.dailyWorkload)}
                    onChange={(e) => {
                        setDailyWorkload(asMinutes(e.target.value));
                    }}
                />
            </div>
            <div className="settingsrow">
                <label htmlFor="monthlywladj">Monthly workload adjustment</label>
                <div>
                    Summary:
                    <span id="monthlywladjsum">{asHoursAndMinutes(settings.monthlyAdjustment.summary)}</span>
                </div>
                <textarea id="monthlywladj"
                    name="monthlywladj"
                    onKeyPress={(e) => {
                        adjustTextAreaHeight(e.target as HTMLTextAreaElement);
                    }}
                    onFocus={(e) => {
                        e.target.setSelectionRange(0,0);
                    }}
                    onBlur={(e) => {
                        setMonthlyAdjustment(e.target.value);
                    }}
                    defaultValue={settings.monthlyAdjustment.details}
                />

            </div>
            <div className="settingsrow">
                <label htmlFor="tasktypes">Task types</label>
                <textarea id="tasktypes"
                    name="tasktypes"
                    onBlur={(e) => {
                        setTaskTypes(e.target.value.split('\n'));
                    }}
                    defaultValue={settings.taskTypes.join('\n')}
                />
            </div>
            <div className="settingsrow license">
                <span id="version">{appVersion}</span>
                <span>Software licensed under LGP-3.0<br/><a href="https://bitbucket.org/lsolova/timeasr">https://bitbucket.org/lsolova/timeasr</a></span>
                <span>Design licensed under CC BY-NC 4.0</span>
                <span>Solova logo is property of Laszlo Solova. All rights reserved.</span>
            </div>
        </div>
    );
}
