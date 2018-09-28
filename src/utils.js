'use strict';

const R = require('ramda');

// We track our own id by creating one from the uuid library, we do not need the mongo Id
// This (or omitIdsFromArray) should be used after any data is grabbed from Mongo
exports.omitId = R.omit(['_id']);

exports.omitUserData = R.omit(['_id', 'password']);

exports.isArray = R.is(Array);

exports.isString = R.is(String);

exports.omitIdsFromArray = R.map(exports.omitId);

exports.omitUserDataFromArray = R.map(exports.omitUserData);
