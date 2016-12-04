'use strict';

var timeUtils = require('./timeUtils'),
    chai = require('chai');

chai.should();

describe('Time utils', function () {
    describe('#addLeadingZeros', function () {
        
        it('with empty string', function () {
            timeUtils.addLeadingZeros('').should.equal('00');
        });

        it('with any character not a number', function () {
            timeUtils.addLeadingZeros('a').should.equal('0a');
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

    describe('#removeLeadingZeros', function () {

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
});