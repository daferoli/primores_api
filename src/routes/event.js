const router = require('express').Router();
const eventHelpers = require('src/events');
const Joi = require('joi');
const eventsValidation = require('src/validations/events');
const utils = require('src/utils');

/**
 * This will get an employee for query
 * It can either list if an array is passed in or read if a string is passed in
 */
router.get('/', (req, res, next) => {
  const reqUids = JSON.parse(req.query.uids);
  let passedUids;
  let returnArray = false;

  if (utils.isString(reqUids)) {
    passedUids = [reqUids];
  } else if (utils.isArray(reqUids)) {
    passedUids = reqUids;
    returnArray = true;
  } else {
    const err = new Error('Passed variable is not valid');
    req.status(400).json(err);
  }

  return eventHelpers.getEvents(passedUids)
  .then((result) => {
    const removedIds = utils.omitIdsFromArray(result);
    if (returnArray) {
      //Expects all from array
      res.json(removedIds)
    } else {
      //Expects only one
      res.json(removedIds[0]);
    }
  })
  .catch(next);
});

router.get('/:uid', (req, res, next) => {
  return eventHelpers.getEvents([req.params.uid])
  .then((result) => {
    res.json(utils.omitId(result[0]));
  })
  .catch(next);
});

router.get('/office/:officeName', (req, res, next) => {
  return eventHelpers.getEventsByOffice(req.params.officeName)
  .then((result) => {
    res.json(utils.omitIdsFromArray(result));
  })
  .catch(next);
});

/**
 * Create new event after validaing body data
 */
router.post('/', (req, res, next) => {
  const valid = Joi.validate(req.body, eventsValidation.create);
  if(valid.error) {
    res.status(400).send(valid.error);
  }
  console.log('Attempting to create event', req.body);
  return eventHelpers.createEvent(req.body)
  .then((createdEvent) => {
    res.json(utils.omitId(createdEvent.value));
  })
  .catch(next);
});

/**
 * Update an event
 */
router.put('/:uid', (req, res, next) => {
  const valid = Joi.validate(req.body, eventsValidation.create);
  if(valid.error) {
    res.status(400).send(valid.error);
  }
  return eventHelpers.updateEvent(req.params.uid, req.body)
  .then((createdEvent) => {
    res.json(utils.omitId(createdEvent.value));
  })
  .catch(next);
});

router.delete('/:uid', (req, res, next) => {
  return eventHelpers.deleteEvent(req.params.uid)
  .then(() => {
    res.json({success:true});
  })
  .catch(next);
});

module.exports = router;
