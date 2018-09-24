'use strict';

const Joi = require('joi');

const userCreate = Joi.object().keys({
  name: Joi.string().required(),
  activeLocations: Joi.array().items(Joi.object().keys({
    name: Joi.string().required(),
    level: Joi.string().required()
  })),
  eventsAttended: Joi.array().items(Joi.string()),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  create: userCreate,
  opts: {
    convert: true,
    stripUnknown: true,
    abortEarly: false
  }
};
