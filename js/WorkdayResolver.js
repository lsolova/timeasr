require('./shim');
var fs = require('fs');

function prepareFilePath(year, country) {
    return 'resources/workdays/'+year+'-'+country+'.json';
}

function readWorkdaysDefinition(year, country) {
    country = country || 'hu';
    if (!fs.existsSync(prepareFilePath(year, country))) {
        country = 'hu';
    }
    if (!fs.existsSync(prepareFilePath(year, country))) {
        return undefined;
    }
    return JSON.parse(fs.readFileSync(prepareFilePath(year, country), 'utf8'));
}

function calculateWorkdays(obj, year, month) {
    var finalWorkdays = [],
        defaultWorkdays = obj.rules.defaultWorkdays,
        workdays = obj.rules.workdays,
        holidays = obj.rules.holidays,
        firstDayOfMonth = new Date(year, month, 1),
        lastDayOfMonth = new Date(year, month + 1, 0),
        i,
        currentDay,
        currentDayAsNumber;

    for (i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
        currentDay = new Date(year, month, i);
        currentDayAsNumber = year * 10000 + (month + 1) * 100 + i;
        if (defaultWorkdays.includes(currentDay.getDay()) && !holidays.includes(currentDayAsNumber)) {
            finalWorkdays.push(i);
        }else if (workdays.includes(currentDayAsNumber)) {
            finalWorkdays.push(i);
        }
    }

    return finalWorkdays;
}

module.exports = {
    getWorkDays: function (year, month, country) {
        var obj = readWorkdaysDefinition(year, country),
            finalWorkdays = calculateWorkdays(obj, year, month);
        return JSON.stringify(finalWorkdays);
    }
};