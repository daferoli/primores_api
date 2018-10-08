'use strict';
const Joi = require('joi');

/**
 * This can be used in a middleware to run joi validation among the incoming request body.
 * @param {Joi Object} schema the schema to run the body against
 * @param {Object} opts optional options to run with the validation.
 */
module.exports = function(schema, opts) {
    return (req, res, next) => { // Have to return the function the express router expects.
        const valid = Joi.validate(req.body, schema, opts);
        if(valid.error) {
            res.status(400).json({
                msg: valid.error
            });
        }
        req.body = valid.value; // We want this in case the valid body changes
        next();
    }
};
