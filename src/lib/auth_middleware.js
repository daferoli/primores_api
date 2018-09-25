'use strict';
const jwt = require('./auth');

exports.verifyJWT = function(req, res, next)
{
  let token = req.get('x-access-token');

  jwt.verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken.data;
      next();
    })
    .catch((err) =>
    {
      res.status(401)
        .json({message: "Invalid auth token provided."});
    });
};