/**
 * Created by max on 16/04/16.
 */
var passwordHash = require('password-hash');

var schema = {
    'first_name': {
        notEmpty: true,
        isAlpha: {
            errorMessage: 'First Name must only contain letters'
        },
        isLength: {
            options: [{ min: 2, max: 50 }],
            errorMessage: 'First Name must be between 2 and 50 characters'
        },
        errorMessage: 'First Name is required'
    },
    'last_name': {
        optional: {
            options: [{ checkFalsy: true }]
        },
        isAlpha: {
            errorMessage: 'Last Name must only contain letters'
        },
        isLength: {
            options: [{ min: 2, max: 50 }],
            errorMessage: 'Last Name must be between 2 and 50 characters'
        }
    },
    'birth': {
        optional: {
            options: [{ checkFalsy: true }]
        },
        isDate: true,
        errorMessage: 'Invalid Date of Birth'
    },
    'email': {
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email'
        },
        errorMessage: 'Email is required'

    }
};

var define = function(db, models) {
    models.user = db.define("users", {
        id          : { type: 'serial', key: true },
        first_name  : { type: 'text', size: 50, required: true },
        last_name   : { type: 'text', size: 50 },
        birth       : { type: 'date', time: false },
        email       : { type: 'text', size: 50, required: true },
        password    : { type: 'text', size: 200 },
        active      : { type: 'boolean', defaultValue: true }
    }, {
        methods: {
            getName: function() {
                return this.first_name + " " + this.last_name;
            }
        }
    });
};

var seed = function(models) {
    // seed admin user
    var adminUser = {};
    adminUser.id = 1;
    adminUser.first_name = "Armin";
    adminUser.last_name = "Admin";
    adminUser.email = "admin@site.com";
    adminUser.password = passwordHash.generate('peter123', { algorithm: 'sha256', saltLength: 64, iterations: 2});
    models.user.create(adminUser, function(err, results) {
        if (err) console.log(err);
    });
};

exports.schema = schema;
exports.define = define;
exports.seed = seed;