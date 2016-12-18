module.exports = function () {
    function resolveKeyVariables(keyString) {
        var nowDate, nowMonth, nowDayOfMonth;
        if (keyString == "currentDate") {
            nowDate = new Date();
            nowMonth = ('' + (nowDate.getMonth()+1));
            nowDayOfMonth = ('' + nowDate.getDate());
            nowMonth = nowMonth.length === 2 ? nowMonth : '0' + nowMonth;
            nowDayOfMonth = nowDayOfMonth.length === 2 ? nowDayOfMonth : '0' + nowDayOfMonth;
            keyString = "" + nowDate.getFullYear() + nowMonth + nowDayOfMonth;
        }
        return keyString;
    }
    this.Given(/^I am visiting the Timeasr page$/, function () {
        browser.url('http://timeasr.solova.com');
    });
    this.When(/^I click on the element with id "([^"]*)"$/, function (elementId, callback) {
        if (browser.waitForVisible(elementId, 2000)) {
            browser.click(elementId);
            callback();    
        } else {
            callback(new Error("The element with id " + elementId + "is not visible"));
        }
    });
    this.Then(/^an entry with name "([^"]*)"( and value "([^"]*)")? is in the localStorage$/,
        function (lsKey, lsText, lsValue, callback) {
            var localStorageResponse = browser.localStorage('GET', resolveKeyVariables(lsKey));
            if (lsValue) {
                if (localStorageResponse.value === lsValue) {
                    callback();
                } else {
                    callback(new Error("The value is not correct"));
                }
            } else {
                if (localStorageResponse.value === null) {
                    callback(new Error("The key does not exists"));
                }
            }
        });
    this.Then(/^an entry with name "([^"]*)" is not in the localStorage$/, function (lsKey, callback) {
        var x = browser.localStorage('GET', lsKey);
        if (x.value === null) {
            callback();
        } else {
            callback(new Error("The value exists: " + x.value));
        }
    });
}
