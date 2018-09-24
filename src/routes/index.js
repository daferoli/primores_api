'use strict';

const router = require('express').Router();
const eventRoutes = require('src/routes/event');
const userRoutes = require('src/routes/user');
const locationRoutes = require('src/routes/location');
const authMiddleware = require('src/lib/auth_middleware');

router.use('/events', eventRoutes);

router.use('/users', authMiddleware.verifyJWT, userRoutes);

router.use('/locations', locationRoutes);

router.get('/test', function(req, res) {
  res.status(200).send('Hello, World!');
});

router.get('/testlogin', function(req,res) {
  res.status(200).send('You are logged in!');
});

module.exports = router;
