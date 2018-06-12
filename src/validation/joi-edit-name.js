const joi = require('joi');

module.exports= joi.object().keys({
  name: joi.string().error(new Error('Name cant be empty')).required(),
  name: joi.string().error(new Error('name invalid')).regex(/^[a-z .'-]+$/i)
})