import Vue from 'vue';

let timerID;
let timeTypes;
let timeValues;
let displayedType = '';

function getActualTimeValue(timeValues, type) {
    return timeValues && timeValues[type] || '';
}

function tick(updateViewCallback) {
    if (!document.hidden) {
        let nextTypeId = displayedType && timeTypes.indexOf(displayedType) + 1 || 0;
        if (nextTypeId === timeTypes.length) { nextTypeId = 0; }
        displayedType = timeTypes[nextTypeId];
        updateViewCallback();
    }
}

export default Vue.component('timeinfo', {
    template: '<div id="leaveValue" v-bind:class="defClass">{{timeValue}}</div>',
    props: {
        isHidden: {
            type: Boolean,
            required: false,
            default: true
        },
        timeValues: {
            type: Object,
            required: true
        }
    },
    methods: {
        changeDisplayedTime() {
            this.timeValue = getActualTimeValue(timeValues, displayedType);
            this.defClass = displayedType + '-bef';
        }
    },
    data: function () {
        return {
            defClass: '',
            timeValue: ''
        }
    },
    mounted: function () {
        timeValues = this.timeValues;
        timeTypes = Object.keys(timeValues).sort();
        timerID = setInterval(
            () => tick(this.changeDisplayedTime),
            5000
        );
    },
    updated: function () {
        timeValues = this.timeValues;
        timeTypes = Object.keys(timeValues).sort();
    },
    beforeDestroy: function () {
        clearInterval(timerID);
    }
});
