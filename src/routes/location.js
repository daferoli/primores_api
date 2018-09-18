'use strict';

const router = require('express').Router();
const locationHelpers = require('src/locations');
const Joi = require('joi');
const utils = require('src/utils');

/**
 * This will list all locations
 */
router.get('/', (req, res, next) => {
    return locationHelpers.getAllLocations()
    .then((result) => {
        res.json(utils.omitIdsFromArray(result));
    })
    .catch(next);
});

/**
 * This will return a specific location's information
 */
router.get('/:locationName', (req, res, next) => {
  return locationHelpers.getLocationByName(req.params.locationName)
  .then((result) => {
    res.json(utils.omitId(result[0]));
  })
  .catch(next);
});

module.exports = router;
