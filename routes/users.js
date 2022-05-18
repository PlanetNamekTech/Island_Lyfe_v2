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
    req.flash('success', 'Welcome to the Island Lyfe');
    res.redirect('/islands'); 
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('register')
  }
}));

router.get('/login', (req,res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
  req.flash('success', 'Welcome Back');
  res.redirect('/islands');
})

module.exports = router;