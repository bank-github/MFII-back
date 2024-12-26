'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ipModel = new Schema({
    budgetYear      : { type: String, required: true },
    nameOnMedia     : { type: String, required: true },
    inventor        : { type: [String], required: true },
    beLongTo        : { type: String, required: true },
    holderOfRight   : { type: String, required: true },
    ipType          : { type: String, required: true },
    requestNo       : { type: String, required: true },
    submitDate      : { type: Date, default: '-' },
    finalStatus     : { type: String, default: true },
    addEditing      : { type: String, default: "-" },
    adsNo           : { type: String, default: "-" },
    adsDate         : { type: Date, default: "-"},
    regNo           : { type: String, default: "-"},
    regDate         : { type: Date, default: "-"},
    expDate         : { type: Date, default: "-"},
    feePay          : { type: String, default: "-"},
    notiFeePay      : { type: String, default: "-"},
    other           : { type: String, default: "-"},
    industType      : { type: String, required: true},
    util            : { type: String, default: "-"},
    note            : { type: String, default: "-"},
}, { timestamps: true });

var ip = mongoose.model('IP', ipModel, 'IP');
module.exports = ip;
