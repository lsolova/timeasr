import React, { useEffect, useState } from 'react';
import { asHoursAndMinutes } from '../logic/time-conversion';

enum ShowItems {
    BY_SELECTED_DAY = 't',
    BY_CUMULATED = 'l',
}

function LeaveValue({bySelectedDay, byCumulated}: {bySelectedDay: number, byCumulated: number}) {
    const [showItem, setShowItem] = useState('t');
    useEffect(() => {
        setInterval(() => {
            if (!document.hidden) {
                setShowItem((showItem) => (showItem === 't') ? 'l' : 't');
            }
        }, 2000);
    }, []);

    return (
        <div id="leaveValue" className={`${showItem}-bef`}>
            {showItem === ShowItems.BY_CUMULATED && asHoursAndMinutes(byCumulated)}
            {showItem === ShowItems.BY_SELECTED_DAY && asHoursAndMinutes(bySelectedDay)}
        </div>
    );
}

export default LeaveValue;
