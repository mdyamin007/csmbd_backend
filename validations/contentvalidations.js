const Joi = require('joi');

exports.contentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  youtubeLink: Joi.string().uri().required()
});
