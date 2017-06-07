import * as timeUtils from './timeCalculation';

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

    describe('#calculateMonthlyAverage', function () {
        it('with no data', function () {
            timeUtils.calculateMonthlyAverage().should.deep.equal({ statValue: 0, statCount: 0 });
        });

        it('with simple data', function () {
            timeUtils.calculateMonthlyAverage([createMeasureTimeObject(12), createMeasureTimeObject(36)], 0)
                .should.deep.equal({ statValue: 24, statCount: 2 });
        });

        it('with adjustment', function () {
            timeUtils.calculateMonthlyAverage([createMeasureTimeObject(24), createMeasureTimeObject(36)], -12)
                .should.deep.equal({ statValue: 24, statCount: 2 });
        });
    });

    describe('#calculateMonthlyDifference', function () {
        it('with no data', function () {
            timeUtils.calculateMonthlyDifference()
                .should.deep.equal({ statValue: 0, statCount: 0 });
        });

        it('with simple data', function () {
            timeUtils.calculateMonthlyDifference([createMeasureTimeObject(12), createMeasureTimeObject(36)], 0, 20)
                .should.deep.equal({ statValue: 8, statCount: 2 });
        });

        it('with adjustment', function () {
            timeUtils.calculateMonthlyDifference([createMeasureTimeObject(24), createMeasureTimeObject(36)], -12, 20)
                .should.deep.equal({ statValue: 8, statCount: 2 });
        });
    });

    describe('#estimateLeavingTime', function () {
        xit('', function () { });
    });
});

function createMeasureTimeObject(value) {
    return {
        getMinutes: function () {
            return value;
        }
    };
}
