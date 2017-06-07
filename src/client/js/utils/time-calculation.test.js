import * as timeUtils from './time-calculation';

import { should } from 'chai';
should();

describe('Time calculation utils', function () {
    describe('#calculateMonthlyAdjustmentFromDetails', function () {
        it('with undefined content', function () {
            timeUtils.calculateMonthlyAdjustmentFromDetails().should.equal(0);
        });

        it('with empty content', function () {
            timeUtils.calculateMonthlyAdjustmentFromDetails('').should.equal(0);
        });

        it('with invalid content', function () {
            timeUtils.calculateMonthlyAdjustmentFromDetails('Invalid content\nMore invalid').should.equal(0);
        });

        it('with one line content', function () {
            timeUtils.calculateMonthlyAdjustmentFromDetails('0:30').should.equal(30);
        });

        it('with negative line content', function () {
            timeUtils.calculateMonthlyAdjustmentFromDetails('-0:30').should.equal(-30);
        });

        it('with multiline content', function () {
            timeUtils.calculateMonthlyAdjustmentFromDetails('1:00\n-0:30').should.equal(30);
        });

        it('with longer text', function () {
            timeUtils.calculateMonthlyAdjustmentFromDetails('0:30 This is a longer\ntext with linebreak')
                .should.equal(30);
        });
    });
});
