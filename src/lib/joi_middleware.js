'use strict';
const Joi = require('joi');

module.exports = function(bodyValidation, opts) {
    return (req, res, next) => { // Have to return the function the express router expects.
        const valid = Joi.validate(req.body, bodyValidation, opts);
        if(valid.error) {
            res.status(400).json({
                msg: valid.error
            });
        }
        req.body = valid.value; // We want this in case the valid body changes
        next();
    }
};
