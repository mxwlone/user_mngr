/**
 * Created by max on 16/04/16.
 */
var should = require('should');
var config = require('../config');

describe("Configuration setup", function() {
    it("should load local configurations", function(next) {
        config().mode.should.equal('local');
        config('local').mode.should.equal('local');
        next();
    });
    it("should load staging configurations", function(next) {
        config('staging').mode.should.equal('staging');
        next();
    });
    it("should load production configurations", function(next) {
        config('production').mode.should.equal('production');
        next();
    });
});