'use strict';

const Joi = require('joi');

const userCreate = Joi.object().keys({
  name: Joi.string().required(),
  activeLocations: Joi.array().items(Joi.object().keys({
    name: Joi.string().required(),
    level: Joi.string().required(),
    status: Joi.string().allow(['active','lead',null])
  })),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const userUpdate = Joi.object().keys({
  name: Joi.string(),
  activeLocations: Joi.array().items(Joi.object().keys({
    name: Joi.string().required(),
    level: Joi.string().required(),
    status: Joi.string().allow(['active','lead',null])
  })),
  email: Joi.string().email()
});

module.exports = {
  create: userCreate,
  update: userUpdate,
  opts: {
    convert: true,
    stripUnknown: true,
    abortEarly: false
  }
};
