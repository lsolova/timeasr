import React from 'react';
import { prepareProps } from './react-utils.js';

export default class RemainingTimeInfo extends React.Component {
    constructor(props) {
        super(prepareProps(props, {
            timeValues: {}
        }));
        this.timeTypes = Object.keys(this.props.timeValues);
        this.timeTypes = this.timeTypes.sort();
        this.state = {
            timeType: this.timeTypes[0],
            timeValue: this.props.timeValues[this.timeTypes[0]]
        };
    }

    componentDidMount() {
        if (this.timeTypes.length > 1) {
            this.timerID = setInterval(
                () => this.tick(),
                5000
            );
        }
    }

    componentWillUnmount() {
        if (this.timerID) {
            clearInterval(this.timerID);
        }
    }

    render() {
        const classList = [],
              timeValue = this.state.timeValue || '',
              conditionalProps = {};
        if (this.props.hidden) { classList.push('hidden'); }
        if (this.state.timeType) { classList.push(this.state.timeType + '-bef'); }
        if (classList.length > 0) {
            conditionalProps.className = classList.join(' ');
        }

        return <div id="leaveValue" {...conditionalProps}>{timeValue}</div>;
    }

    tick() {
        if (!this.props.hidden && !document.hidden) {
            this.setState(function (prevState, props) {
                let nextTypeId = this.timeTypes.indexOf(prevState.timeType) + 1;
                if (nextTypeId === this.timeTypes.length) { nextTypeId = 0; }
                return {
                    timeType: this.timeTypes[nextTypeId],
                    timeValue: props.timeValues && props.timeValues[this.timeTypes[0]] || ''
                }
            });
        }
    }
}
