const Joi = require('joi');

exports.createUserDesignSchema = Joi.object({
  user_business_id: Joi.number().integer().required(),
  description: Joi.string().allow('', null),
  visibility: Joi.string().valid('public', 'private').default('private'),
});

exports.updateUserDesignSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().allow('', null),
  visibility: Joi.string().valid('public', 'private'),
});

exports.listQuerySchema = Joi.object({
  user_business_id: Joi.number().integer(),
  subscription_id: Joi.number().integer(),
});
