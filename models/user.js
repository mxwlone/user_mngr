/**
 * Created by max on 16/04/16.
 */
var passwordHash = require('password-hash');

var schema = {
    'first_name': {
        notEmpty: {
            errorMessage: 'First Name is required'
        },
        isAlpha: {
            errorMessage: 'First Name must only contain letters'
        },
        isLength: {
            options: [{ min: 2, max: 20 }],
            errorMessage: 'First Name must be between 2 and 20 characters'
        }
    },
    'last_name': {
        optional: {
            options: [{ checkFalsy: true }]
        },
        isAlpha: {
            errorMessage: 'Last Name must only contain letters'
        },
        isLength: {
            options: [{ min: 2, max: 20 }],
            errorMessage: 'Last Name must be between 2 and 20 characters'
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
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Invalid Email'
        },
        isLength: {
            options: [{ min: 6, max: 30 }],
            errorMessage: 'Email must be between 6 and 30 characters'
        }
    },
    'password': {
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isLength: {
            options: [{ min: 3, max: 20 }],
            errorMessage: 'Password must be between 3 and 20 characters'
        }
    }
};

var define = function(db, models) {
    models.user = db.define("users", {
        id          : { type: 'serial', key: true },
        first_name  : { type: 'text', size: 20, required: true },
        last_name   : { type: 'text', size: 20 },
        birth       : { type: 'date', time: false },
        email       : { type: 'text', size: 30, required: true },
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
    adminUser.birth = "1986-03-01";
    adminUser.password = passwordHash.generate('peter123', { algorithm: 'sha256', saltLength: 64, iterations: 2});
    models.user.create(adminUser, function(err, results) {
        if (err) console.log(err);
    });
};

exports.schema = schema;
exports.define = define;
exports.seed = seed;