const Joi = require('joi');

exports.createPlan = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().positive().required(),
  duration: Joi.number().integer().positive().required(),
  features: Joi.object().required(),
});

exports.updatePlan = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  price: Joi.number().positive(),
  duration: Joi.number().integer().positive(),
  features: Joi.object(),
});
