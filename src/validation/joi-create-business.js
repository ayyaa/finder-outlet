const baseJoi = require('joi');
const extens = require('joi-date-extensions');
const Joi = baseJoi.extend(extens);

module.exports = Joi.object().keys({
  // get_category: Joi.array().error(new Error('Line of Business is required.')).required(),
  name_business: Joi.string().error(new Error('Username is required.')).required(),
  name_business: Joi.string().min(8).max(30).error(new Error('Username is invalid.')),
  email: Joi.string().error(new Error('Email is required.')).required(),
  email: Joi.string().email().error(new Error('Email is invalid.')),
  website: Joi.string().error(new Error('Website is required')).required(),
  description: Joi.string().error(new Error('description is required.')).required(),
  line1: Joi.string().error(new Error('Line 1 is required.')).required(),
  line2: Joi.string().error(new Error('Line 2 is required.')).required(),
  state: Joi.string().error(new Error('State is required.')).required(),
  province: Joi.string().error(new Error('Province is required.')).required(),
  city: Joi.string().error(new Error('City is required.')).required(),
  postal_code: Joi.string().error(new Error('Postal Code is required.')).required(),
  lat: Joi.string().error(new Error('Latitude is required.')).required(),
  lng: Joi.string().error(new Error('Longitude is required.')).required(),
  contact_no: Joi.number().error(new Error('Contact Number is Required')).required(),
  // image: Joi.string().error(new Error('Image is Required')).required(),
})
