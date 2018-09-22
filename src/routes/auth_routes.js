const express = require('express');

const db = require('../models');
const jwt  = require('../lib/auth');
const middleware = require('../lib/auth_middleware');

const router = express.Router();

router.post('*', middleware.paramCheck(['email', 'password']));

router.post('/login', (req, res) =>
{
  let { email, password } = req.body;

  db.User.findByEmail(email)
  .then((user) => (!user) ? Promise.reject("User not found.") : user)
  .then((user) => user.comparePassword(password))
  .then((user) => user.publicParse(user))
  .then((user) =>
  {
    res.status(200)
      .json({
        success: true,
        token: jwt.createJWToken({
            sessionData: user,
            maxAge: 3600
        })
      });
  })
  .catch((err) =>
  {
    res.status(401)
      .json({
        message: err || "Validation failed. Given email and password aren't matching."
      });
  });
});

//router.post('/logout', (req,res)) TODO

exports.router = router;