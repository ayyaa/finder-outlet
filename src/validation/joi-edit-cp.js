const joi = require('joi');

module.exports= joi.object().keys({
  cp: joi.string().error(new Error('contact number must be filled with digit number')).regex(/^[0-9]+$/i)
})