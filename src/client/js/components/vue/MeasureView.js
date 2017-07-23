import Vue from 'vue';

export default Vue.component('measure-view', {
    props: {
        viewData: {
            required: true
        }
    },
    template: `
    <div id="measure" class="view">
        <div id="topNavBar">
            <div id="summaryToolbar">
                <span id="month"></span>
                <span id="stattime"></span>
                <span id="daycount"></span>
            </div>
            <div id="daySelector">
                <div id="prevDay" class="day"></div>
                <div id="actlDay" class="day actl"></div>
                <div id="nextDay" class="day"></div>
            </div>
        </div>
        <div id="counter">
            <div id="counterValue"></div>
            <div id="leaveValueC">
                <timeinfo :is-hidden="timeInfo.isHidden" :time-values="timeInfo.timeValues"></timeinfo>
            </div>
        </div>
        <div class="menuBar">
            <router-link to="/settings">g</router-link>
        </div>
    </div>
    `,
    data: function () {
        return {
            timeInfo: this.viewData.timeInfo
        }
    }
});
