const Joi = require('joi');

exports.createSubscription = Joi.object({
  user_id: Joi.number().integer().required(),
  plan_id: Joi.number().integer().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  status: Joi.string().valid('active', 'expired', 'cancelled', 'pending', 'upgraded').required(),
});

exports.updateSubscription = Joi.object({
  user_id: Joi.number().integer(),
  plan_id: Joi.number().integer(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  status: Joi.string().valid('active', 'expired', 'cancelled', 'pending', 'upgraded'),
});

exports.checkout = Joi.object({
  plan_id: Joi.number().integer().positive().required(),
  plan_duration_unit: Joi.string().valid('MONTH', 'YEAR').default('MONTH'), // 'MONTH' for monthly, 'YEAR' for yearly
});

exports.verifyPayment = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  order_id: Joi.number().integer().positive().required(),
});
