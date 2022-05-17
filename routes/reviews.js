const express = require('express');
const router = express.Router({mergeParams: true}); ////Router() doesn't explicitly give access to req.params

const catchAsync = require('../Utils/catchAsync');
const ExpError = require('../Utils/ExpError');
const Island = require('../models/island');
const Review = require('../models/review');
const { reviewSchema }  = require('../schemas');

const validateReview = (req,res,next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error) {
    let msg = error.details.map(element => element.message).join(',')
    throw new ExpError(msg, 400)
  } else {
    next();
  }
}

router.post('/', validateReview, catchAsync(async(req,res) => {
  const island = await Island.findById(req.params.id);
  const review = new Review(req.body.review);
  island.reviews.push(review);
  await review.save();
  await island.save();
  req.flash('success', 'Review successfully updated');
  res.redirect(`/islands/${island._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req,res) => {
  const { id, reviewId } = req.params;
  await Island.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review successfully deleted');
  res.redirect(`/islands/${id}`);
}))

module.exports = router;