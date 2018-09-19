'use strict';

const router = require('express').Router();
const eventRoutes = require('src/routes/event');
const userRoutes = require('src/routes/user');
const locationRoutes = require('src/routes/location');

router.use('/events', eventRoutes);

router.use('/users', userRoutes);

router.use('/locations', locationRoutes);

router.get('/test', function(req, res) {
  res.status(200).send('Hello, World!');
});

module.exports = router;
