"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require("../models/userModel")

var messageModel = new Schema({
    userId           : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    BusinessType     : {type:String, require: true},
    Description      : { type: String, require: true },
    Scope            : { type: String, require: true },
});

var message = mongoose.model("message", messageModel, "message");
module.exports = message;
