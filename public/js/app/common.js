"use strict";

define(function () {
    var EventBus = {
        topics: {},
        subscribe: function(topic, listener) {
            if(!this.topics[topic]) {
                this.topics[topic] = [];
            }
            this.topics[topic].push(listener);
        },
        publish: function(topic, data) {
            if(!this.topics[topic] || this.topics[topic].length < 1) {
                return;
            }
            this.topics[topic].forEach(function(listener) {
                listener(data || {});
            });
        }
    };

    var inherit = function (sub, base) {
        var Temp = function () {
            this.constructor = sub;
        };
        Temp.prototype = base.prototype;
        sub.prototype = new Temp();
    };

    return {
        eventBus: EventBus,
        inherit: inherit
    }
});