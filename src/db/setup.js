/**
 * This file helps with the setup of the database on starting up the api. Any indexes can be setup here.
 * To setup a new index:
 * add an object to the indexInfo array containing:
 *  - collection -> the collection to add the inex to.
 *  - index -> the field to add the index on
 *  - opts: any extra mongo options.
 */

'use strict';
const db = require('src/db');
const R = require('ramda');
const usersCollection = db.collection('users');

const indexInfo = [
    {
        collection: usersCollection,
        index:'email',
        opts:{
            unique: true
        }
    }
];

function createIndex(info) {
    console.log('Creating index in collection: %s for field: %s', info.collection, info.index);
    info.collection.createIndex({[info.index]:1}, info.opts);
}

exports.createIndexes = () => {
    R.forEach(createIndex, indexInfo);
}
