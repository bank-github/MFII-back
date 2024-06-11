"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require("../models/userModel")

var messageModel = new Schema({
    userId           : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    businessType     : {type:String, require: true},
    businessName     : { type: String, require: true },
    interestTech     : { type: String, require: true },
    usesScope        : { type: String, require: true },
    messageReply     : [{
        userId    : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
        messages  : { type: String, required: true }
    }],
});

var message = mongoose.model("message", messageModel, "message");
module.exports = message;
