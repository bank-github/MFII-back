'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicesModel = new Schema({
    information       : { type: String, required: true },
    servicesType     : { type: String, required: true },
    servicesSubType  : { type: String, default: "-" },
    linkServices  : { type: String, default: "-" },
    filePath         : { type: [String], default: [] }
}, { timestamps: true });

var services = mongoose.model('services', servicesModel, 'services');
module.exports = services;
