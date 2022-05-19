const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      catchAsync = require('../Utils/catchAsync');
      passport = require('passport');

router.get('/register', (req, res) =>{
  res.render('users/register')
})

router.post('/register', catchAsync(async (req,res) => {
  try {
    const {email, username, password} = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success', 'Welcome to the Island Lyfe');
      res.redirect('/islands'); 
    })
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('register')
  }
}));

router.get('/login', (req,res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
  let { username } = req.body;
  req.flash('success', `Welcome Back ${username}`);
  const redirectUrl = req.session.returnTo || '/islands';
  delete req.session.returnTo; // delete returnTo object from session, no need to store it
  res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
  req.logout(); //Another built in passport function
  req.flash('success', 'Successfully logged out');
  res.redirect('/islands')
})

module.exports = router;