'use strict';

const usersDao = require('src/dao/users');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * Creates a new user in the dao and assigns it a uid
 * @param {*} userData validated user data
 */
exports.createUser = function(userData) {
    userData.uid = uuid();
    return bcrypt.hash(userData.password, saltRounds)
    .then((hashedData) => {
        userData.password = hashedData;
        return usersDao.upsertUser({
        uid: userData.uid
        }, userData);
    })
    .then((createInfo) => {
        console.log('Created User: ', createInfo);
    })
    .catch((err) => {
        console.error(err.message);
        if(err.code === 11000) {
            throw new Error('Email already registered in system');
        } else {
            throw new Error(err.message);
        }
    });
};

/**
 * takes an array of uids and returns the result as an array
 * @param {Array} uids list of users to retrieve
 */
exports.getUsers = function(uids) {
    return usersDao.getUsersForQuery({
        uid: {$in: uids || []}
    });
};

exports.getUserByEmail = function(email){
    return usersDao.getUsersForQuery({
        email: email
    })
    .then((userArray) => userArray[0]);
}

/**
 * Updates a single user
 */
exports.updateUser = function(uid, userData) {
    return usersDao.updateUser({
        uid: uid
    }, {
        $set: userData
    }, {
        upsert: false,
        new: true
    });
};

exports.deleteUser = function(uid) {
    return usersDao.deleteUsers({
        uid: uid
    });
};

exports.comparePassword = function(user, password) {
    console.log('hashword: ', user);
    console.log('password: ', password);
    return bcrypt.compare(password, user.password)
    .then((res) => {
        if(res === true) {
            return user;
        } else {
            throw new Error('Password does not match!');
        }
    });
}
