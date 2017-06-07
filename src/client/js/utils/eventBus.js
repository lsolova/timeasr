// @deprecated

const topics = {};

export function subscribe(topic, listener) {
    if(!topics[topic]) {
        topics[topic] = [];
    }
    topics[topic].push(listener);
}

export function publish(topic, data) {
    if(!topics[topic] || topics[topic].length < 1) {
        return;
    }
    topics[topic].forEach(function(listener) {
        listener(data || {});
    });
}
