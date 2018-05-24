const baseJoi = require('joi');
const extens = require('joi-date-extensions');
const Joi = baseJoi.extend(extens);

module.exports = Joi.object().keys({
  username: Joi.string().error(new Error('Username is required.')).required(),
  email: Joi.string().error(new Error('Email is required.')).required(),
  email: Joi.string().email().error(new Error('Email is invalid.'))
  // image: Joi.string().error(new Error('Image is Required')).required(),
})