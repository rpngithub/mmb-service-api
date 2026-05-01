const Joi = require('joi');

exports.createRole = Joi.object({
  name: Joi.string().required(),
});

exports.updateRole = Joi.object({
  name: Joi.string(),
});
