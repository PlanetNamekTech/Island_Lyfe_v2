const express = require('express');
const router = express.Router({mergeParams: true}); //Router() doesn't explicitly give access to req.params

const catchAsync = require('../Utils/catchAsync');
const ExpError = require('../Utils/ExpError');
const Island = require('../models/island');
const Review = require('../models/review');
const { reviewSchema }  = require('../schemas');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;