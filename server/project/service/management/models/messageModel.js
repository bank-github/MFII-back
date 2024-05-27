'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageModel = new Schema({
    title           : [{
        key            : {type: String, default: null},
        value          : {type: String, default: null},
    }],
    description     : [{
        key            : {type: String, default: null},
        value          : {type: String, default: null},
    }],
    state           : {type: Boolean, default: true},
    create          : {
        by              : {type: Schema.ObjectId, ref: 'Infomation_Admins'},
        datetime        : {type: Date, default: Date.now}
    },

});

var message = mongoose.model('message', messageModel, 'message');
module.exports = message;
