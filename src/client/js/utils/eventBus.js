'use strict';

module.exports = {
    topics: {},
    subscribe: function subscribe(topic, listener) {
        if(!this.topics[topic]) {
            this.topics[topic] = [];
        }
        this.topics[topic].push(listener);
    },
    publish: function publish(topic, data) {
        if(!this.topics[topic] || this.topics[topic].length < 1) {
            return;
        }
        this.topics[topic].forEach(function(listener) {
            listener(data || {});
        });
    }
}