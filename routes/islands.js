const express = require('express');
const router = express.Router();
const { islandSchema } = require('../schemas');
const catchAsync = require('../Utils/catchAsync');
const ExpError = require('../Utils/ExpError');
const Island = require('../models/island');

const validateIsland = (req,res,next) => {
  const {error} = islandSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(element => element.message).join(',')
    throw new ExpError(msg, 400)
  } else {
    next();
  }
}

// router.get('/', (req, res) => {
//   res.render('home')
// });

router.get('/', catchAsync(async(req, res) => {
  const islands = await Island.find({});
  res.render('islands/index', { islands });
}))

router.get('/new', (req, res) => {
  res.render('islands/new')
})

router.post('/', validateIsland, catchAsync(async(req,res) => {
  const island = new Island(req.body.island);
  await island.save();
  req.flash('success', 'Successfully added island!');
  res.redirect(`/islands/${island._id}`)
}))

router.get('/:id' , catchAsync(async(req,res) => {
  const island = await Island.findById(req.params.id).populate('reviews');
  if(!island){
    req.flash('error', 'Cannot locate desired island');
    res.redirect('/islands');
  }
  res.render('islands/show', { island });
}))

router.get('/:id/edit', catchAsync(async(req,res) => {
  const island = await Island.findById(req.params.id);
  if(!island){
    req.flash('error', 'Cannot locate desired island');
    res.redirect('/islands');
  }
  res.render('islands/edit', { island });
}))

router.put('/:id', validateIsland, catchAsync(async(req, res) => {
  const { id } = req.params;
  const island = await Island.findByIdAndUpdate(id, {...req.body.island});
  req.flash('success', 'Successfully updated island!');
  res.redirect(`/islands/${island._id}`);
}))

router.delete('/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  await Island.findByIdAndDelete(id);
  req.flash('success', 'Island successfully deleted');
  res.redirect('/islands');
}))

module.exports = router;