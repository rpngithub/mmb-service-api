const Joi = require('joi');

exports.createSubscription = Joi.object({
  user_id: Joi.number().integer().required(),
  plan_id: Joi.number().integer().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  status: Joi.string().valid('active', 'expired', 'cancelled').required(),
});

exports.updateSubscription = Joi.object({
  user_id: Joi.number().integer(),
  plan_id: Joi.number().integer(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  status: Joi.string().valid('active', 'expired', 'cancelled'),
});
