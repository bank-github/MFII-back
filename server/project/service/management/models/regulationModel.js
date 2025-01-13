'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regulationModel = new Schema({
    regulationName     : { type: String, required: true },
    filePath        : { type: [String], default: []}
}, { timestamps: true });

var regulation = mongoose.model('regulation', regulationModel, 'regulation');
module.exports = regulation;
