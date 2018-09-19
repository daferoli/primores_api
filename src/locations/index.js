'use strict';

const locationDao = require('src/dao/locations');

exports.getAllLocations = function() {
    return locationDao.getLocationForQuery();
};

exports.getLocationByName = function(locationName) {
    return locationDao.getLocationForQuery({
        name: locationName
    });
};
