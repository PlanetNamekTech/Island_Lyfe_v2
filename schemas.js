const Joi = require('joi');

module.exports.islandSchema = Joi.object({
  island: Joi.object({
    title: Joi.string().required(),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    hemisphere: Joi.string().required()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required()
  }).required()
})