'use strict';

module.exports = {
    inherit: function inherit(sub, base) {
        var Temp = function () {
            this.constructor = sub;
        };
        Temp.prototype = base.prototype;
        sub.prototype = new Temp();
    }
}