const Joi = require('joi');

exports.createUserRole = Joi.object({
  user_id: Joi.number().integer().required(),
  role_id: Joi.number().integer().required(),
});

exports.updateUserRole = Joi.object({
  user_id: Joi.number().integer(),
  role_id: Joi.number().integer(),
});
