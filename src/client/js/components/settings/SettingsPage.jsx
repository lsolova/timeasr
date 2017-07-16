import React from 'react';
import { Link } from 'react-router-dom';

class SettingsPage extends React.Component {
    render() {
        return (
            <div id="settings-page" className="view">
                <div id="topTitleBar">
                    <h1>Settings <span id="dwlForMonth"></span></h1>
                </div>
                <div className="settingsrow">
                    <label htmlFor="dailywl">Daily workload</label>
                    <input id="dailywl" name="dailywl" type="text"/>
                </div>
                <div className="settingsrow">
                    <label htmlFor="monthlywladj">Monthly workload adjustment</label>
                    <div>Summary: <span id="monthlywladjsum"></span></div>
                    <textarea id="monthlywladj" name="monthlywladj"></textarea>
                </div>
                <div id="license" className="settingsrow">
                    <span id="version">ver 0.9.2</span>
                    <span>Software licensed under LGP-3.0<br/>
                        <a href="https://bitbucket.org/lsolova/timeasr">https://bitbucket.org/lsolova/timeasr</a>
                    </span>
                    <span>Design licensed under CC BY-NC 4.0</span>
                    <span>Solova logo and font is property of Laszlo Solova. All rights reserved.</span>
                </div>
                <div className="menuBar">
                    <Link to="/">i</Link>
                </div>
            </div>
        );
    }
}

export default SettingsPage;
