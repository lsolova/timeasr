import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from "./home/HomePage.jsx";
import SettingsPage from './settings/SettingsPage.jsx';

class App extends React.Component {
    render() {
        return (
            <div className="content">
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/settings" component={SettingsPage} />
                </Switch>
                <div id="notification"></div>
                <div id="copyright"></div>
            </div>
        );
    }
}

export default App;
