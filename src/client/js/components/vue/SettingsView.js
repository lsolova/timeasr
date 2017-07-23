import Vue from 'vue';

export default Vue.component('settings-view', {
    template: `
    <div id="settings" class="view">
        <div id="topTitleBar">
            <h1>Settings <span id="dwlForMonth"></span></h1>
        </div>
        <div class="settingsrow">
            <label for="dailywl">Daily workload</label>
            <input id="dailywl" name="dailywl" type="text"/>
        </div>
        <div class="settingsrow">
            <label for="monthlywladj">Monthly workload adjustment</label>
            <div>Summary: <span id="monthlywladjsum"></span></div>
            <textarea id="monthlywladj" name="monthlywladj"></textarea>
        </div>
        <div id="license" class="settingsrow">
            <span id="version">ver 0.9.2</span>
            <span>Software licensed under LGP-3.0<br><a href="https://bitbucket.org/lsolova/timeasr">https://bitbucket.org/lsolova/timeasr</a></span>
            <span>Design licensed under CC BY-NC 4.0</span>
            <span>Solova logo and font is property of Laszlo Solova. All rights reserved.</span>
        </div>
        <div class="menuBar">
            <router-link to="/measure">i</router-link>
        </div>
    </div>
    `
});
