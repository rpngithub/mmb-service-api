const Joi = require('joi');

const signupSchema = Joi.object({
  // step 1
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/),
  // step 2
  user_id: Joi.string(),
  transaction_id: Joi.string(),
  otp: Joi.string().length(6),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signinMobileSchema = Joi.object({
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  transaction_id: Joi.string(),
  otp: Joi.string().length(6),
});

const verifyOtpSchema = Joi.object({
  transaction_id: Joi.string().required(),
  otp: Joi.string().length(6).required(),
});

const requestOtpSchema = Joi.object({
  send_to: Joi.string().required(),
});

module.exports = { signupSchema, signinSchema, signinMobileSchema, verifyOtpSchema, requestOtpSchema };
