const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      catchAsync = require('../Utils/catchAsync'),
      passport = require('passport'),
      users = require('../controllers/users');

router.route('/register')
  .get(users.renderRegisterForm)
  .post(catchAsync(users.register));

router.route('/login')
  .get(users.renderLoginForm)
  .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);

router.get('/logout', users.logout)

module.exports = router;