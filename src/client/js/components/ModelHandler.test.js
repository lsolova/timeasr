import * as modelHandler from './ModelHandler';
import { asDay } from '../utils/timeConversion';
import * as store from './PersistentStore';
import * as dateWrapper from '../utils/dateWrapper';

import { should } from 'chai';
import { stub } from 'sinon';
should();

describe('ModelHandler', function () {
    let storeGetStub;

    beforeEach(function () {
        storeGetStub = stub(store, "get");
    });
    afterEach(function () {
        storeGetStub.restore();
    });

    describe('#getTimeOfDay', function () {
        it('if day not exists', function () {
            storeGetStub.callsFake(function () {
                return null;
            });
            modelHandler.getTimeOfDay('20150710').getMinutes().should.equal(0);
        });

        it('if day already exists', function () {
            storeGetStub.callsFake(function () {
                return 15;
            });
            modelHandler.getTimeOfDay('20150710').getMinutes().should.equal(15);
        });
    });

    describe('#getMonthlyMeasuredTimes', function () {
        it('with two measured days', function () {
            let timeResult;
            storeGetStub.callsFake(function (dayIndex) {
                let dayMinutes = {
                    '20150401': '145',
                    '20150402': '120'
                };
                return Object.keys(dayMinutes).includes(dayIndex) ? dayMinutes[dayIndex] : null;
            });
            timeResult = modelHandler.getMonthlyMeasuredTimes({
                getDay: function () {
                    return 4;
                },
                getFullDay: function () {
                    return '20150404'
                }
            });
            timeResult[0].getMinutes().should.equal(145);
            timeResult[1].getMinutes().should.equal(120);
        });
    });

    describe('#getActualDay', function () {
        it('getting day (fake date wrapper testing)', function () {
            const fakeTime = 1496733252000,
                dateStub = stub(dateWrapper, 'now');
            dateStub.callsFake(function () {
                return fakeTime;
            });
            modelHandler.getActualDay().getFullDay().should.equal(asDay(fakeTime));
            dateStub.restore();
        });
    });

    describe('#setActualDay', function () {
        xit('', function () { });
    });
});
