'use strict';

// I do not know if I will be validating with this, as I will not allow creating or editing events through the API yet,
// but it will serve as documentation on the location data structure for now

const locationCreate = Joi.object().keys({
    name: Joi.string().required(),
    leads: Joi.array().items(Joi.string().guid({version:['uuidv4']})), //UIDs of the office/region leads
    parentLocation: Joi.string().required()
});

module.exports = {
    create: locationCreate,
    opts: {
        convert: true,
        stripUnknown: true,
        abortEarly: false
    }
}
