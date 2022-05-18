module.exports.isLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated()) {                  // isAuthenticated() is part of passport, not found in their docs
    req.flash('error', 'You must be signed in')
    return res.redirect('/login');
  }
  next();
}