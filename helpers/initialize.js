'use strict';

var mongoose = require('mongoose');
var redis = require('redis');
var cfg = require('../config/config');
var resMsg = require('../config/message');
var mongodb = null;

exports.init = function (callback) {
    mongoose.Promise = global.Promise;
    mongodb = mongoose.connect(cfg.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log('----- Connect To MongoDB Error Status[' + JSON.stringify(err) + '] -----');
        return callback(true);
    });

    db.once('open', function () {
        // we're connected!
        global.mongodb = db;
        console.log('----- Connect To Mongodb Status[' + JSON.stringify(resMsg.getMsg(20000)) + '] -----');
        return callback(true);
    });

    db.on('connected',console.info.bind(console,"MongoDB connection is connected:"))
};
//db.createUser({user:"securitys",pwd:"Zk8K3BE3k8ASEr4A",roles:[{role:"readWrite",db:"securitys"}]})
