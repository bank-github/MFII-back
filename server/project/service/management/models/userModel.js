'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userModel = new Schema({
     username           : {type: String, require: true},
     password           : {type: String, require: true},
     age                : {type: Number, default: 0},
});

var user = mongoose.model('user', userModel, 'user');
module.exports = user;
