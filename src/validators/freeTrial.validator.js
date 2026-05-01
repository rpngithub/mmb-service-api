const Joi = require('joi');

exports.createFreeTrial = Joi.object({
  user_id: Joi.number().integer().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  status: Joi.string().valid('active', 'expired', 'cancelled').required(),
});

exports.updateFreeTrial = Joi.object({
  user_id: Joi.number().integer(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  status: Joi.string().valid('active', 'expired', 'cancelled'),
});
