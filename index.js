'use strict';

const express = require('express');
const env = require('env-var');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const HOST_PORT = env.get('PRIMORES_PORT', 9090).asIntPositive();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api', require('src/routes'));

app.listen(HOST_PORT, () => console.log('API listening on port ' + HOST_PORT));
