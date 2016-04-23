var express = require('express');
var router = express.Router();
var util = require('util');
var passwordHash = require('password-hash');
var user = require('../models/user.js');


/* GET users listing */
router.get('/list', function(req, res, next) {
  req.models.user.find({ active: true }, { order: 'id'}).omit('password').run(function(err, results) {
    res.render('user/list', { title: 'User list', users: results });
  });
});

/* GET user new */
router.get('/new', function(req, res, next) {
  res.render('user/new', { title: 'New user', message: req.flash('message'), errors: req.flash('errors') });
});

/* POST user save */
router.post('/save', function(req, res, next) {
  console.log('Input');
  console.log(req.body);

  // sanitize input
  req.sanitize('first_name').trim();
  req.sanitize('last_name').trim();
  req.sanitize('email').trim();

  // validate input
  req.check(user.schema);

  // validate passwords
  req.check('password', 'Passwords do not match').equals(req.body.password_confirm);
  var mappedErrors = req.validationErrors(true);

  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    res.redirect('new');
    return;
  }

  var newUser = {};

  // required fields
  newUser.password = passwordHash.generate(req.body.password, { algorithm: 'sha256', saltLength: 64, iterations: 2});
  newUser.first_name = req.body.first_name;
  newUser.email = req.body.email;

  // optional optional fields
  if (req.body.last_name != '') newUser.last_name = req.body.last_name;
  if (req.body.birth_submit != '') newUser.birth = req.body.birth_submit;

  req.models.user.create(newUser, function(err, results) {
    if (err) {
      console.log(err);
      req.flash('message', 'User could not be created. Please contact an administrator.');
      res.redirect('new');
    } else {
      console.log("User created:");
      console.log(newUser);
      res.redirect('/user');
    }
  });
});


module.exports = router;