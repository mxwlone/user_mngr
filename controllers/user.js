var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');


/* GET users listing */
router.get('/', function(req, res, next) {
  req.models.user.find({ active: true }, { order: 'id'}).omit('password').run(function(err, results) {
    res.render('user/list', { title: 'User list', users: results });
  });
});

/* GET user new */
router.get('/new', function(req, res, next) {
  res.render('user/new', { title: 'New user', message: req.flash('message') });
});

/* POST user save */
router.post('/save', function(req, res, next) {
  var newUser = {};
  if (req.body.password && req.body.password === req.body.password_confirm) {
    newUser.password = passwordHash.generate(req.body.first_name, { algorithm: 'sha256', saltLength: 64, iterations: 2});
  } else {
    req.flash('message', 'The passwords did not match.');
    res.redirect('/user/new');
    return next();
  }
  if (req.body.first_name) newUser.first_name = req.body.first_name;
  if (req.body.last_name) newUser.last_name = req.body.last_name;
  if (req.body.email) newUser.email = req.body.email;
  if (req.body.birth) newUser.birth = req.body.birth;

  req.models.user.create(newUser, function(err, results) {
    if (err) {
      console.log(err);
      req.flash('message', 'User could not be created. Please contact an administrator.');
      res.redirect('/user/new');
      return next();
    } else {
      console.log("User created:");
      console.log(newUser);
      res.redirect('/user');
      return next();
    }
  });
});


module.exports = router;