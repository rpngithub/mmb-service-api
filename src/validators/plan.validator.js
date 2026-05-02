const Joi = require('joi');

exports.createPlan = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().positive().required(),
  duration: Joi.number().integer().positive().required(),
  duration_unit: Joi.string().valid('MONTH', 'YEAR').required(),
  features: Joi.object().required(),
});

exports.updatePlan = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  price: Joi.number().positive(),
  duration: Joi.number().integer().positive(),
  duration_unit: Joi.string().valid('MONTH', 'YEAR'),
  features: Joi.object(),
});
