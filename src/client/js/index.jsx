import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './components/App.jsx';
// import routes from './routes.jsx';
// import '../style/measure.css';

render(
    <HashRouter>
        <App />
    </HashRouter>,
    document.getElementById('app')
);
