'use strict';

const express = require('express');
const env = require('env-var');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('src/lib/auth_middleware');
const dbSetup = require('src/db/setup');
const Promise = require('bluebird');

const app = express();
const HOST_PORT = env.get('PRIMORES_PORT', 9090).asIntPositive();

dbSetup.createIndexes();

app.use(bodyParser.json());
app.use(cors());

app.use('/', require('src/routes/auth_routes'));

app.use('/api', require('src/routes'));


//I want to add global error handling here to prevent the api hanging on uncaught error

app.listen(HOST_PORT, () => console.log('API listening on port ' + HOST_PORT));
