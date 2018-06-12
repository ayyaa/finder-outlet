const joi = require('joi');

module.exports= joi.object().keys({
  email: joi.string().error(new Error('Email is required.')).required(),
  email: joi.string().email().error(new Error('Email is invalid.'))
})