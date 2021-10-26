import React, { Fragment, useEffect, useState } from 'react';
import { loadInitialData } from '../state/store';
import MeasureView from './measure-view';
import MenuBar from './menu-bar';
import SettingsView from './settings-view';

function App() {
    const [activeView, setActiveView] = useState<string>('measure');

    useEffect(() => {
        loadInitialData();
    }, []);

    return (
        <Fragment>
            <MenuBar setActiveView={setActiveView} />
            {activeView === 'measure'
                ? <MeasureView />
                : <SettingsView appVersion={'app-version'}/>
            }
            <div id="copyright"></div>
        </Fragment>
    );
}

export default App;
