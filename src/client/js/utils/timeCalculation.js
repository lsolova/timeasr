import { asMinutes } from './timeConversion';

const timeregex = /^[+]?([-]?\d{1,2}:\d{2}) ?.*$/;

export function calculateMonthlyAdjustmentFromDetails(valueList) {
    let sumValue = 0;
    if (valueList) {
        sumValue = valueList
            .split('\n')
            .reduce(function (accValue, splitValue) {
                splitValue = splitValue.trim();
                if (splitValue.length > 0 && timeregex.test(splitValue)) {
                    const splitHoursAndMinutes = timeregex.exec(splitValue)[1];
                    accValue += asMinutes(splitHoursAndMinutes);
                }
                return accValue;
            }, 0);
    }
    return sumValue;
}
