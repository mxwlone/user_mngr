var express = require('express');
var router = express.Router();
var util = require('util');
var passwordHash = require('password-hash');
var user = require('../models/user.js');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', new Date().toLocaleString());
  // maybe log things in database here
  // check if some audit module exists first
  next();
});

/* GET user listing */
router.get('/list', function(req, res, next) {
  req.models.user.find({ active: true }, { order: 'id'}).omit('password').run(function(err, results) {
    console.log(typeof(results[0].birth));
    res.render('user/list', { title: 'User list', users: results });
  });
});

/* POST user listing */
router.post('/list', function(req, res, next) {
  if(req.body.id) {
    res.redirect('/user/' + req.body.id);
  } else {
    res.redirect('back');
  }
});

/* PARAM id */
router.param('id', function (req, res, next, id) {
  req.models.user.get(id, function(err, user) {
    if (err) {
      console.log(err);
      next();
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});


/* GET user edit */
router.get('/:id', function(req, res, next) {
  if (!req.user) {
    next();
    return;
  }
  var user = req.flash('user')[0];
  console.log('flashed user object');
  console.log(user);
  if(!user) user = req.user;
  else user.id = req.user.id;

  res.render('user/edit', { title: 'Edit user', message: req.flash('message'), errors: req.flash('errors'), user: user });
});

/* GET user new */
router.get('/new', function(req, res, next) {
  var user = req.flash('user')[0];
  console.log('flashed user object');
  console.log(user);

  res.render('user/edit', { title: 'New user', message: req.flash('message'), errors: req.flash('errors'), user: user });
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
  if ( !(req.body.id && !req.body.password && !req.body.password_confirm) ) {
    req.check('password', 'Password is required').notEmpty();
    req.check('password', 'Password must be between 3 and 20 characters').isLength({ min: 3, max: 20 });
    req.check('password', 'Passwords do not match').equals(req.body.password_confirm);
    var mappedErrors = req.validationErrors(true);
  }

  // TODO validate email is unique

  var newUser = {};
  if (req.body.password) newUser.password = passwordHash.generate(req.body.password, { algorithm: 'sha256', saltLength: 64, iterations: 2});
  if (req.body.first_name) newUser.first_name = req.body.first_name;
  if (req.body.email) newUser.email = req.body.email;
  if (req.body.last_name) newUser.last_name = req.body.last_name;
  if (req.body.birth_submit) newUser.birth = req.body.birth_submit;

  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    if (req.body.birth != '') newUser.birth = req.body.birth;
    req.flash('user', newUser);
    res.redirect('back');
    return;
  }

  // update
  if (req.body.id) {
    req.models.user.get(req.body.id, function(err, user) {
      if (err) {
        console.log(err);
      } else if (user) {
        user.first_name = newUser.first_name;
        user.last_name = newUser.last_name;
        user.email = newUser.email;
        if (newUser.birth) user.birth = new Date(newUser.birth);
        if (newUser.password) user.password = newUser.password;
        user.save(function (err) {
          console.log(err);
        });
        console.log("User updated");
        res.redirect('/user/list');
      }
    });
  // or create
  } else {
    req.models.user.create(newUser, function (err, results) {
      if (err) {
        console.log(err);
        req.flash('message', 'User could not be created. Please contact an administrator.');
        res.redirect('back');
      } else {
        console.log("User created");
        res.redirect('/user/list');
      }
    });
  }
});


module.exports = router;