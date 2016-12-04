'use strict';

module.exports = {
    addLeadingZeros: function addLeadingZeros(value) {
        var resultValue = value;
        while (resultValue.length < 2) {
            resultValue = '0' + resultValue;
        }
        return resultValue;
    },
    removeLeadingZero: function removeLeadingZero(value) {
        return value.startsWith('0') ? value.substr(1) : value;
    }

}