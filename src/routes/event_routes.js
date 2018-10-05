'use strict';

const router = require('express').Router();
const eventHelpers = require('src/events');
const joiValidation = require('src/lib/joi_middleware');
const eventsValidation = require('src/validations/events');
const utils = require('src/utils');
const authMiddleware = require('src/lib/auth_middleware');

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

router.get('/location/:locationName', (req, res, next) => {
    return eventHelpers.getEventsByLocation(req.params.locationName)
    .then((result) => {
        res.json(utils.omitIdsFromArray(result));
    })
    .catch(next);
});

/**
 * Create new event after validaing body data
 */
router.post('/', joiValidation(eventsValidation.create, eventsValidation.opts), (req, res, next) => {
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
router.put('/:uid', joiValidation(eventsValidation.update, eventsValidation.opts), (req, res, next) => {
    return eventHelpers.updateEvent(req.params.uid, req.body)
    .then((createdEvent) => {
        res.json(utils.omitId(createdEvent.value));
    })
    .catch(next);
});

/**
 * Add attendee
 */
router.put('/:uid/attendees/add', joiValidation(eventsValidation.attendee, eventsValidation.opts), (req,res,next) => {
    const valid = Joi.validate(req.body, eventsValidation.attendee);
    if(valid.error) {
        res.status(400).send(valid.error);
    }
    if(canUserChangeAttendance(req.params.uid, req.body, req.userEmail)) {
        eventHelpers.addToAttendeeArray(req.params.uid, req.body);
    }
});

router.put('/:uid/atendees/remove', joiValidation(eventsValidation.attendee, eventsValidation.opts), (req,res,next) => {
    if(canUserChangeAttendance(req.params.uid, req.body, req.userEmail)) {
        eventHelpers.removeFromAttendeeArray(req.params.uid, req.body);
    }
});

router.delete('/:uid', (req, res, next) => {
    return eventHelpers.deleteEvent(req.params.uid)
    .then(() => {
        res.json({success:true});
    })
    .catch(next);
});

/**
 * TODO
 * get the event, attendee, and user info from the db.
 * Check the event location.
 * If the user submitting is a lead in that office, return true. Leads can add anyone to an event.
 * Else if the user === the attendee (i.e. the attendee is requesting himself to be added) AND that user is active in the office, return true.
 * Else return false
 */
const canUserChangeAttendance = function(eventUid, attendeeData, userUid) {
    return true;
}

module.exports = router;
