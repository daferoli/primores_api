'use strict';

const db = require('src/db');
const locationCollection = db.collection('locations');

exports.getLocationForQuery = function (query) {
  let projection = {};
  if(!query) {
      query = {};
  }
  if (query.projection) {
    projection = query.projection;
    delete query.projection;
  }

  return locationCollection.find(query, projection)
  .then((cursor) => cursor.toArray());
};
