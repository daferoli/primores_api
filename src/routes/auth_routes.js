'use strict';
const express = require('express');

const users = require('src/users');
const jwt  = require('src/lib/auth');
const middleware = require('src/lib/auth_middleware');
const userValidation = require('src/validations/users');
const loginValidation = require('src/validations/auth');
const joiValidation = require('src/lib/joi_middleware');


const router = express.Router();

router.post('/login', joiValidation(loginValidation.login, loginValidation.opts), (req, res) =>
{
  let { email, password } = req.body;

  users.getUserByEmail(email)
  .then((user) => (!user) ? Promise.reject("User not found.") : user)
  .then((user) => users.comparePassword(user, password))
  .then((user) =>
  {
    res.status(200)
    .json({
      success: true,
      loggedInUser: user.email,
      token: jwt.createJWToken({
        sessionData: user.email,
        maxAge: 3600
      })
    });
  })
  .catch((err) =>
  {
    console.error('There was Error: ', err);
    res.status(401)
    .json({
      message: err || "Validation failed. Given email and password aren't matching."
    });
  });
});

router.post('/signup', joiValidation(userValidation.create, userValidation.opts), (req, res) => {
  return users.createUser(req.body)
  .then(() => res.status(201).send('User Created'))
  .catch((err) => res.status(400).send('Error on User Create: ' + err));
})

//router.post('/logout', (req,res)) This may be able to be done with just the UI

module.exports = router;