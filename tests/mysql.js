/**
 * Created by max on 16/04/16.
 */
var should = require('should');
var orm = require("orm");
var config = require("../config")('local');


describe("MySQL - '" + config.mode + "' config", function() {
    it("is there a server running", function(next) {
        var url = "mysql://" + config.mysql.user + ":" + config.mysql.password + "@" +
                config.mysql.host + ":" + config.mysql.port + "/" + config.mysql.database;
        orm.connect(url, function (err, db) {
            should.equal(err, null);
            next();
        });
    });
});