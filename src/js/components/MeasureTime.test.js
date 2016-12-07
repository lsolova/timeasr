'use strict';

const measureTime = require('./MeasureTime'),
      chai = require('chai');

chai.should();

describe("MeasureTime", function () {
    
    it('Define and check two MeasureTime objects', function () {
        var mTime1 = measureTime.create('20150405', 15),
            mTime2 = measureTime.create('20160408', 74);
        
        mTime1.getYearAndMonth().should.equal('201504');
        mTime1.getDay().should.equal(5);
        mTime1.getMinutes().should.equal(15);

        mTime2.getYearAndMonth().should.equal('201604');
        mTime2.getDay().should.equal(8);
        mTime2.getMinutes().should.equal(74);
    });

    describe('#addMinutes', function () {
        var mTime;

        beforeEach(function () {
            mTime = measureTime.create('20150405', 15);
        });

        it('add negative integer', function () {
            mTime.addMinutes(-74);
            mTime.getMinutes().should.equal(-59);
        });

        it('add zero', function () {
            mTime.addMinutes(0);
            mTime.getMinutes().should.equal(15);
        });

        it('add positive integer', function () {
            mTime.addMinutes(74);
            mTime.getMinutes().should.equal(89);
        });
    });
    

});

