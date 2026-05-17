const Joi = require('joi');

exports.submit = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null).optional(),
  query_type: Joi.string().allow('', null).optional(),
  notes: Joi.string().trim().min(1).required(),
});

exports.updateStatus = Joi.object({
  status: Joi.string().valid('new', 'in_progress', 'resolved').required(),
});
