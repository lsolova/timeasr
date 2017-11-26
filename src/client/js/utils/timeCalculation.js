import { asMinutes } from 'scripts/utils/timeConversion';

const timeregex = /^[+]?([-]?\d{1,2}:\d{2}) ?.*$/;

function calculateStatistics(measuredTimes, loopCalculation, postCalculation) {
    let measuredTimeObj = { dayCount: 0, statTime: 0 };

    if (measuredTimes && typeof measuredTimes.reduce === 'function') {
        measuredTimeObj = measuredTimes.reduce(function (accObj, measuredTime) {
            if (0 < measuredTime.getMinutes()) {
                accObj.statTime += loopCalculation(measuredTime);
                accObj.dayCount++;
            }
            return accObj;
        }, measuredTimeObj);
    }

    return {
        statValue: postCalculation(measuredTimeObj.statTime, measuredTimeObj.dayCount),
        statCount: measuredTimeObj.dayCount
    };
}

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

export function calculateMonthlyAverage(measuredTimes, monthlyAdjustment) {
    return calculateStatistics(measuredTimes
        , function (measuredTime) {
            return measuredTime.getMinutes();
        }
        , function (statTime, dayCount) {
            return dayCount === 0 ? 0 : Math.floor((statTime + monthlyAdjustment) / dayCount);
        }
    );
}

export function calculateMonthlyDifference(measuredTimes, monthlyAdjustment = 0, expectedDayTime = 0) {
    return calculateStatistics(measuredTimes
        , function (measuredTime) {
            return measuredTime.getMinutes() - expectedDayTime;
        }
        , function (statTime) {
            return statTime + monthlyAdjustment;
        }
    );
}

export function estimateLeavingTime(dailyTime = 0, differenceTime = 0, expectedDayTime) {
    let leavingTime = 0;
    if (dailyTime >= 0) {
        let calcTime = expectedDayTime - (dailyTime + differenceTime);
        if (calcTime > 0) {
            let todayDate = new Date();
            leavingTime = todayDate.getHours() * 60 + todayDate.getMinutes() + calcTime;
        }
    }
    return leavingTime;
}
