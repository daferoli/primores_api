'use strict';

const eventsDao = require('src/dao/events');
const uuid = require('uuid/v4');

/**
 * Creates a new event in the dao and assigns it a uid
 * @param {*} eventData validated event data
 */
exports.createEvent = function(eventData) {
    eventData.uid = uuid();

    return eventsDao.upsertEvent({
        uid: eventData.uid
    }, eventData);
};

/**
 * takes an array of uids and returns the result as an array
 * @param {Array} uids list of events to retrieve
 */
exports.getEvents = function(uids) {
    return eventsDao.getEventsForQuery({
        uid: {$in: uids || []}
    });
};

exports.getEventsByLocation = function(locationName) {
    return eventsDao.getEventsForQuery({
        location: locationName
    });
}

/**
 * Updates a single event
 */
exports.updateEvent = function(uid, eventData) {
    return eventsDao.upsertEvent({
        uid: uid
    }, {
        $set: eventData
    }, {
        upsert: false,
        new: true
    });
};

// Add an attendee to an event
exports.addToAttendeeArray = function(uid, attendeeData) {
    return eventsDao.upsertEvent({
        uid: uid
    }, {
        $push: {
            attendees: attendeeData
        } //TODO: It may not be a bad idea in the future to run pull before this to make sure only 1 instance of the user stays in the db
    }, {
        upsert: false,
        new: true
    });
}

// Add an attendee to an event
exports.removeFromAttendeeArray = function(uid, attendeeData) {
    return eventsDao.upsertEvent({
        uid: uid
    }, {
        $pull: {
            attendees: attendeeData
        }
    }, {
        upsert: false,
        new: true
    });
}

// Delete an event.
exports.deleteEvent = function(uid) {
  return eventsDao.deleteEvents({
    uid: uid
  });
};

// Archive an event. We will want to do this to change the status of past events
// NOTE: no routes currently use this. the intention is to run a script to archive after the event date is passed.
exports.archiveEvent = function(uid) {
    return eventsDao.upsertEvent({
        uid
    }, {
        $set:{
            status: 'archived'
        }
    });
}
