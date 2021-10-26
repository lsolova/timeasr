import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { getStore } from './state/store';
import App from './components/app';
import '../style/measure.css';

window.onload = function () {
    ReactDOM.render(
        <Provider store={getStore()}>
            <App />
        </Provider>,
        document.getElementById('app-container'),
    );
}
