const baseJoi = require('joi');
const extens = require('joi-date-extensions');
const Joi = baseJoi.extend(extens);

module.exports = Joi.object().keys({
  get_business: Joi.string().error(new Error('Business is required.')).required(),
  name_outlet: Joi.string().error(new Error('name of outlet is required.')).required(),
  email: Joi.string().error(new Error('Email is required.')).required(),
  email: Joi.string().email().error(new Error('Email is invalid.')),
  website: Joi.string().uri().error(new Error('Website is invalid')).required(),
  contact_no: Joi.error(new Error('Contact Number is required')).required(),
  contact_no: Joi.number().error(new Error('Contact Number is invalid')).required(),
  description: Joi.string().error(new Error('description is required.')).required(),
  state: Joi.string().error(new Error('State is required.')).required(),
  region: Joi.string().error(new Error('Province is required.')).required(),
  city: Joi.string().error(new Error('City is required.')).required(),
  postal_code: Joi.string().error(new Error('Postal Code is required.')).required(),
  line1: Joi.string().error(new Error('Line 1 is required.')).required(),
  line2: Joi.string().error(new Error('Line 2 is required.')).required(),
  lat: Joi.string().error(new Error('Latitude is required.')).required(),
  lng: Joi.string().error(new Error('Longitude is required.')).required(),
  
  // image: Joi.string().error(new Error('Image is Required')).required(),
})
