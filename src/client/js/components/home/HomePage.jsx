import React from 'react';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
    render() {
        return (
            <div id="home-page" className="view">
                <div id="topNavBar">
                    <div id="summaryToolbar">
                        <span id="month"></span>
                        <span id="stattime"></span>
                        <span id="daycount"></span>
                    </div>
                    <div id="daySelector">
                        <div id="prevDay" className="day"></div>
                        <div id="actlDay" className="day actl"></div>
                        <div id="nextDay" className="day"></div>
                    </div>
                </div>
                <div id="counter">
                    <div id="counterValue"></div>
                    <div id="leaveValueC"></div>
                </div>
                <div className="menuBar">
                    <Link to="/settings">g</Link>
                </div>
            </div>
        );
    }
}

export default HomePage;
