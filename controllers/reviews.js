const Island = require('../models/island'),
      Review = require('../models/review');

module.exports.createReview = async(req,res) => {
  const island = await Island.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  island.reviews.push(review);
  await review.save();
  await island.save();
  req.flash('success', 'Review successfully added');
  res.redirect(`/islands/${island._id}`);
}

module.exports.deleteReview = async(req,res) => {
  const { id, reviewId } = req.params;
  await Island.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review successfully deleted');
  res.redirect(`/islands/${id}`);
}