const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpError = require('./Utils/ExpError');
const mtdOverride = require('method-override');


const islands = require('./routes/islands');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/island-lyfe')

const database = mongoose.connection;
database.on('error', console.error.bind(console, "connection error"));
database.once('open', () => {
  console.log("Database connected");
});
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(mtdOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: 'islandparadise',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000*60*60*24*7, // A week from today, Date.now() initially in ms
    maxAge: 1000*60*60*24*7 // Takes precedence in most browsers
  }
};

app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/islands', islands);
app.use('/islands/:id/reviews', reviews)

app.all('*', (req,res,next) => {
  next(new ExpError("Page not Found", 404))
})

app.use((e, req, res, next) => {
  const { statusCode=500 } = e;
  if(!e.message) e.message = "Something Went Wrong";
  res.status(statusCode).render('error', { e });
})

app.listen(3000, () =>{
  console.log("Serving on port 3000")
})