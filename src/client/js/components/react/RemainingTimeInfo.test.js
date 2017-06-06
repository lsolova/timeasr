import { checkRendered } from './react-test-utils';
import RemainingTimeInfo from './RemainingTimeInfo.jsx';

describe('RemainingInfoTime', function () {
    it('render without any parameter', function () {
        const expected = '<div id="leaveValue"></div>';
        checkRendered(RemainingTimeInfo, expected, {});
    });

    it('render with hidden', function () {
        const expected = '<div id="leaveValue" class="hidden"></div>';
        checkRendered(RemainingTimeInfo, expected, {hidden: true});
    });

    it('render with content', function () {
        const expected = '<div id="leaveValue" class="l-bef">3:14</div>';
        checkRendered(RemainingTimeInfo, expected, {timeValues: {l: '3:14'}});
    });

    it('render with type l (leave)', function () {
        const expected = '<div id="leaveValue" class="l-bef"></div>';
        checkRendered(RemainingTimeInfo, expected, {timeValues: {l: ''}});
    });

    it('render with type t (workday time)', function () {
        const expected = '<div id="leaveValue" class="t-bef"></div>';
        checkRendered(RemainingTimeInfo, expected, {timeValues: {t: ''}});
    });
});

