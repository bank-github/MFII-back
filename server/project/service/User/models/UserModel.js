'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserModel = new Schema({
    UserName           : {type: String, require:true},
    Password           : {type: String, require:true},
});

var User = mongoose.model('User', UserModel, 'User');
module.exports = User;