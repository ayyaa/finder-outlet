const baseJoi = require('joi');
const extens = require('joi-date-extensions');
const Joi = baseJoi.extend(extens);

module.exports = Joi.object().keys({
  name_category: Joi.string().error(new Error('Name category is required.')).required(),
  description: Joi.string().error(new Error('Description is required.')).required()
})
