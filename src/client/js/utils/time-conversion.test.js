import * as timeUtils from './time-conversion';
import { now } from './dateWrapper';

import { expect, should } from 'chai';
should();

const timezoneOffsetInMilliSeconds = new Date().getTimezoneOffset() * 60 * 1000;

describe('Time conversion utils', function () {
    describe('#addLeadingZeros', function () {

        it('with empty string', function () {
            timeUtils.addLeadingZeros('').should.equal('00');
        });

        it('with any character not a number', function () {
            timeUtils.addLeadingZeros('a').should.equal('0a');
        });

        it('with three characters', function () {
            timeUtils.addLeadingZeros('abc').should.equal('abc');
        });

        it('with a number value', function () {
            timeUtils.addLeadingZeros(4).should.equal('04');
        });

        it('with 1 digit that is 0', function () {
            timeUtils.addLeadingZeros('0').should.equal('00');
        });

        it('with 1 digit differ from 0', function () {
            timeUtils.addLeadingZeros('2').should.equal('02');
        });

        it('with 2 digits where the first digit is 0', function () {
            timeUtils.addLeadingZeros('02').should.equal('02');
        });

        it('with 2 digits where the first digit differs from 0', function () {
            timeUtils.addLeadingZeros('12').should.equal('12');
        });

    });

    describe('#asDay', function () {

        it('with undefined', function () {
            timeUtils.asDay().should.equal(timeUtils.asDay(now()));
        });

        it('with zero', function () {
            timeUtils.asDay(3600000 + timezoneOffsetInMilliSeconds).should.equal('19700101');
        });

        it('with time in milliseconds 1969-12-11 (negative integer)', function () {
            timeUtils.asDay(-1797985800 + timezoneOffsetInMilliSeconds).should.equal('19691211');
        });

        it('with time in milliseconds 2015-10-15 (positive integer)', function () {
            timeUtils.asDay(1444896000000 + timezoneOffsetInMilliSeconds).should.equal('20151015');
        });

    });

    describe('#removeLeadingZero', function () {

        it('with empty string', function () {
            timeUtils.removeLeadingZero('').should.equal('');
        });

        it('with any non-zero character', function () {
            timeUtils.removeLeadingZero('a').should.equal('a');
        });

        it('with one leading zero', function () {
            timeUtils.removeLeadingZero('01').should.equal('1');
        });

        it('with multiple leading zeros', function () {
            timeUtils.removeLeadingZero('001').should.equal('01');
        });

    });

    describe('#asTimeInMillis', function () {
        it('with a misformatted date string', function () {
            timeUtils.asTimeInMillis('2017-05-01').should.be.NaN;
        });

        it('with a proper date string', function () {
            timeUtils.asTimeInMillis('20170501').should.equal(1493596800000 + timezoneOffsetInMilliSeconds);
        });
    });

    describe('#asMinutes', function () {
        it('with not a number', function () {
            timeUtils.asMinutes('asd').should.be.NaN;
        });

        it('with minutes only', function () {
            timeUtils.asMinutes(30).should.equal(30);
        });

        it('with positive time string', function () {
            timeUtils.asMinutes('+0:45').should.equal(45);
        });

        it('with simple time string', function () {
            timeUtils.asMinutes('1:08').should.equal(68);
        });

        it('with negative time string', function () {
            timeUtils.asMinutes('-0:27').should.equal(-27);
        });
    });

    describe('#asHoursAndMinutes', function () {
        it('with undefined', function () {
            timeUtils.asHoursAndMinutes().should.be.NaN;
        });

        it('with an empty string', function () {
            timeUtils.asHoursAndMinutes('').should.be.NaN;
        });

        it('with a string', function () {
            timeUtils.asHoursAndMinutes('Invalid').should.be.NaN;
        });

        it('with a positive number', function () {
            timeUtils.asHoursAndMinutes(34).should.equal('0:34');
        });

        it('with a negative number', function () {
            timeUtils.asHoursAndMinutes(-69).should.equal('-1:09');
        });
    });

    describe('#asMonth', function () {
        it('with undefined', function () {
            expect(timeUtils.asMonth()).to.be.undefined;
        });

        it('with string', function () {
            expect(timeUtils.asMonth('Invalid')).to.be.undefined;
        });

        it('with negative number', function () {
            timeUtils.asMonth(-145000 + timezoneOffsetInMilliSeconds).should.equal('196912');
        });

        it('with positive integer', function () {
            timeUtils.asMonth(1493596800000 + timezoneOffsetInMilliSeconds).should.equal('201705');
        });
    });

    describe('#siblingDay', function () {
        it('with undefined', function () {
            expect(timeUtils.siblingDay()).to.be.undefined;
        });

        it('with 0 direction', function () {
            timeUtils.siblingDay('20150501', 0).should.equal('20150501');
        });

        it('with negative direction', function () {
            timeUtils.siblingDay('20150501', -1).should.equal('20150430');
        });

        it('with positive direction', function () {
            timeUtils.siblingDay('20150501', 1).should.equal('20150502');
        });
    });
});
