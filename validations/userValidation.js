const Joi = require('joi');

exports.userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  // password update can be added with proper handling if desired
});
