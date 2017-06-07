import * as modelHandler from './ModelHandler';
import { asDay } from '../utils/time-conversion';
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
        xit('', function () {});
    });
});
