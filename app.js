var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var orm = require('orm');
var session = require('express-session');
var flash = require('connect-flash');
var config = require('./config')();

var routes = require('./controllers/index');
var user = require('./controllers/user');

var app = express();

// database setup
var userModel = require('./models/user.js');

var url = "mysql://" + config.mysql.user + ":" + config.mysql.password + "@" +
    config.mysql.host + ":" + config.mysql.port + "/" + config.mysql.database + "?" + config.mysql.params;
app.use(orm.express(url, {
  define: function (db, models, next) {
    userModel.model(db, models);

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
app.use(session({
  secret: 'c4319c57fa7608df58726f5ca841cc8c',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// uncomment to grant jade templates access to the session object
//app.use(function(req,res,next){
//  res.locals.session = req.session;
//  next();
//});

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
