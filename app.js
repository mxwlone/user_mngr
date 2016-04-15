var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var orm = require('orm');
var passwordHash = require('password-hash');

var routes = require('./routes/index');
var user = require('./routes/user');

var app = express();

// database setup
app.use(orm.express("mysql://root:peter123@localhost/user_management?debug=true", {
  define: function (db, models, next) {
    models.user = db.define("users", {
      id          : { type: 'serial', key: true },
      first_name  : { type: 'text', size: 50 },
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

    // drop previous tables
    db.drop(function () {

      // create tables
      db.sync(function(err) {
        if (err) throw err;

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
      });
    });

    next();
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
