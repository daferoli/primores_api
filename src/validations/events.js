'use strict';

const Joi = require('joi');

const eventGet = Joi.array().items(Joi.string().guid({version:['uuidv4']}).required());

const eventCreate = Joi.object().keys({
  location: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  status: Joi.string().allow(['active', 'archived']),
  attendees: Joi.array().items(Joi.object().keys({
    userUid: Joi.string().guid({version:['uuidv4']}).required(),
    email: Joi.string().email().required() // email here is used as human readable element for UI
  })),
  cost: Joi.number().min(0).precision(2),
  date: Joi.date().iso().min('now').required()
});

const eventUpdate = Joi.object().keys({
  uid: Joi.string().guid({version:['uuidv4']}).required(),
  location: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  status: Joi.string().allow(['active', 'archived']),
  attendees: Joi.array().items(Joi.object().keys({
    userUid: Joi.string().guid({version:['uuidv4']}).required(),
    email: Joi.string().email().required() // email here is used as human readable element for UI
  })),
  cost: Joi.number().min(0).precision(2),
  date: Joi.date().iso().min('now')
});

const attendeeUpdate = Joi.object().keys({
  userUid: Joi.string().guid({version:['uuidv4']}).required(), //users uid
  email: Joi.string().email().required()
});

module.exports = {
  get: eventGet,
  create: eventCreate,
  update: eventUpdate,
  attendee: attendeeUpdate,
  opts: {
    convert: true,
    stripUnknown: true,
    abortEarly: false
  }
};

