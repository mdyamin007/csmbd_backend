const Joi = require('joi');

exports.userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  bio: Joi.string().max(500),
  website: Joi.string().uri()
  // password update can be added with proper handling if desired
});
