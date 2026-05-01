const Joi = require('joi');

exports.createBusiness = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  parent: Joi.number().integer().allow(null)
});

exports.updateBusiness = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  parent: Joi.number().integer().allow(null),
});
