const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const mtdOverride = require('method-override');
const Island = require('./models/island');

mongoose.connect('mongodb://localhost:27017/island-lyfe')

const database = mongoose.connection;
database.on('error', console.error.bind(console, "connection error"));
database.once('open', () => {
  console.log("Database connected");
});
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(mtdOverride('_method'))

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/islands', async(req, res) => {
  const islands = await Island.find({});
  res.render('islands/index', { islands });
})

app.get('/islands/new', (req, res) => {
  res.render('islands/new')
})

app.post('/islands', async(req,res) => {
  const island = new Island(req.body.island);
  await island.save();
  res.redirect(`/islands/${island._id}`)
})

app.get('/islands/:id' ,async(req,res) => {
  const island = await Island.findById(req.params.id);
  res.render('islands/show', { island });
})

app.get('/islands/:id/edit', async(req,res) => {
  const island = await Island.findById(req.params.id);
  res.render('islands/edit', { island });
})

app.put('/islands/:id', async(req, res) => {
  const { id } = req.params;
  const island = await Island.findByIdAndUpdate(id, {...req.body.island});
  res.redirect(`/islands/${island._id}`);
})

app.delete('/islands/:id', async(req, res) => {
  const { id } = req.params;
  await Island.findByIdAndDelete(id);
  res.redirect('/islands');
})

app.listen(3000, () =>{
  console.log("Serving on port 3000")
})