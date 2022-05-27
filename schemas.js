const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {}, // Not allowing any tags or attributes to be logged
        });
        if (clean !== value) return helpers.error('string.escapeHTML', {value}) // If the input does not match the sanitized input, run helper error
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension);

module.exports.islandSchema = Joi.object({
  island: Joi.object({
    title: Joi.string().required().escapeHTML(), // Any time there is text input, it should use the above escapeHTML
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    hemisphere: Joi.string().required()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required().escapeHTML()
  }).required()
})