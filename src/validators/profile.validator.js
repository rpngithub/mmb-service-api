const Joi = require('joi');

exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  userBusiness: Joi.object({
    business_id: Joi.number(),
    brand_name: Joi.string().max(255),
    description: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    phone_number: Joi.string().allow('', null),
    mobile_number: Joi.string().allow('', null),
    logo: Joi.string().allow('', null),
    website: Joi.string().allow('', null),
    address: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    zip_code: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
    youtube_link: Joi.string().allow('', null),
    facebook_link: Joi.string().allow('', null),
    instagram_link: Joi.string().allow('', null),
    linkedin_link: Joi.string().allow('', null),
    design_preferences: Joi.object({
      postType: Joi.array().items(Joi.string()).default([]),
      designStyle: Joi.array().items(Joi.string()).default([]),
      contentTone: Joi.array().items(Joi.string()).default([]),
    }).allow(null),
    reference_link: Joi.string().allow('', null),
    delivery_preference: Joi.string().valid('Whatsapp', 'Email').allow(null),
    branding_status: Joi.string().valid('READY', 'ONLY_LOGO', 'NEED_HELP').allow(null),
  }).optional(),
});

exports.updateMobileSchema = Joi.object({
  mobile: Joi.string().pattern(/^\d{10}$/).required(),
  transaction_id: Joi.string(),
  otp: Joi.string().length(6),
});
