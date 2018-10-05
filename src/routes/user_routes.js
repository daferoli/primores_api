'use strict';

const router = require('express').Router();
const userHelpers = require('src/users');
const validation = require('express-joi-validation')();
const usersValidation = require('src/validations/users');
const authMiddleware = require('src/lib/auth_middleware');
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

  return userHelpers.getUsers(passedUids)
  .then((result) => {
    const removedIds = utils.omitUserDataFromArray(result);
    if (returnArray) {
      //Expects all from array
      res.status(200).json(removedIds)
    } else {
      //Expects only one
      res.status(200).json(removedIds[0]);
    }
  })
  .catch(next);
});

// Return data of the currently logged in (by JWT) user
router.get('/me', authMiddleware.verifyJWT, (req, res, next) => {
  // req.userEmail should be added in the verifyJWT middleware
  return userHelpers.getUserByEmail(req.userEmail)
  .then((userData) => {
    res.status(200).json(utils.omitUserData(userData));
  })
  .catch(next);
});

/**
 * update an user
 */
router.put('/:uid', validation.body(usersValidation.update), (req, res, next) => {
  return userHelpers.updateUser(req.params.uid, req.body)
  .then((createduser) => {
    res.json(utils.omitUserData(createduser.value));
  })
  .catch(next);
});

router.delete('/:uid', (req, res, next) => {
  return userHelpers.deleteUser(req.params.uid)
  .then(() => {
    res.status(204).json({success:true});
  })
  .catch(next);
});

module.exports = router;
