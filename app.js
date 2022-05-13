const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { islandSchema } = require('./schemas.js')
const catchAsync = require('./Utils/catchAsync');
const ExpError = require('./Utils/ExpError');
const mtdOverride = require('method-override');
const Island = require('./models/island');

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

const validateIsland = (req,res,next) => {
  const { error } = islandSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpError(msg, 400)
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/islands', catchAsync(async(req, res) => {
  const islands = await Island.find({});
  res.render('islands/index', { islands });
}))

app.get('/islands/new', (req, res) => {
  res.render('islands/new')
})

app.post('/islands', validateIsland, catchAsync(async(req,res) => {
  const island = new Island(req.body.island);
  await island.save();
  res.redirect(`/islands/${island._id}`)
}))

app.get('/islands/:id' , catchAsync(async(req,res) => {
  const island = await Island.findById(req.params.id);
  res.render('islands/show', { island });
}))

app.get('/islands/:id/edit', catchAsync(async(req,res) => {
  const island = await Island.findById(req.params.id);
  res.render('islands/edit', { island });
}))

app.put('/islands/:id', validateIsland, catchAsync(async(req, res) => {
  const { id } = req.params;
  const island = await Island.findByIdAndUpdate(id, {...req.body.island});
  res.redirect(`/islands/${island._id}`);
}))

app.delete('/islands/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  await Island.findByIdAndDelete(id);
  res.redirect('/islands');
}))

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