'use strict';

const Joi = require('joi');

const validLogin = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  login: validLogin,
  opts: {
    convert: true,
    stripUnknown: true,
    abortEarly: false
  }
};
