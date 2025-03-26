const Joi = require('joi');

exports.contentSchema = Joi.object({
  youtubeLink: Joi.string().uri().required()
});
