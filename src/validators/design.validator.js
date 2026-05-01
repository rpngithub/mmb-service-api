const Joi = require('joi');

exports.createDesign = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  file_url: Joi.string().uri().required(),
  created_by: Joi.number().integer().required(),
  visibility: Joi.string().valid('public', 'subscription-based').required(),
});

exports.updateDesign = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(''),
  file_url: Joi.string().uri(),
  created_by: Joi.number().integer(),
  visibility: Joi.string().valid('public', 'subscription-based'),
});
