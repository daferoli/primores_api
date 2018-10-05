'use strict';

const router = require('express').Router();
const eventRoutes = require('src/routes/event_routes');
const userRoutes = require('src/routes/user_routes');
const locationRoutes = require('src/routes/location_routes');
const authMiddleware = require('src/lib/auth_middleware');

router.use('/events', eventRoutes);

router.use('/users', userRoutes);

router.use('/locations', locationRoutes);

router.get('/test', function(req, res) {
  res.status(200).send('Hello, World!');
});

router.get('/testlogin', authMiddleware.verifyJWT,
 function(req,res) {
  res.status(200).send('You are logged in!');
});

module.exports = router;
