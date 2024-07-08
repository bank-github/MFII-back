'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userModel = new Schema({
     email           : {type: String, require: true},
     password        : {type: String, require: true},
     firstName       : {type: String, require: true},
     lastName        : {type: String, require: true},
     phoneNumber     : {type: String, require: true},
     businessType     : {type:String, require: true},
     businessName     : { type: String, require: true, default: "-"},
     role            : {type: String, require: true, default: "user"},
     status          : {type: String, require: true, default: "active"}
}, { timestamps: true });

var user = mongoose.model('user', userModel, 'user');
module.exports = user;
