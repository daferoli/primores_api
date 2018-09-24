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
