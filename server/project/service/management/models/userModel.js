'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userModel = new Schema({
     email           : {type: String, require: true},
     password        : {type: String, require: true},
     firstName       : {type: String, require: true},
     lastName        : {type: String, require: true},
     PhoneNumber     : {type: String, require: true},
     role            : {type: String, require: true, default: "user"}, //or number 0=user, 1=staff, 2=admin
});

var user = mongoose.model('user', userModel, 'user');
module.exports = user;
