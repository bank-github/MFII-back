'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var researchModel = new Schema({
    filePath        : { type: [String], required: true },
    industryType    : { type: String, required: true },
    intelProp       : { type: String, required: true },
    techReadiness   : { type: String, required: true },
    name            : { type: String, required: true },
    inventor        : { type: String, required: true },
    major           : { type: String, required: true },
    description     : { type: String, required: true },
    highlight       : { type: [String], required: true },
    coop            : { type: [String], required: true },
    link            : { type: String, required: true },
    status          : { type: Number, required: true },
});

var research = mongoose.model('research', researchModel, 'research');
module.exports = research;
