'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var researchModel = new Schema({
    budgetYear      : { type: String, required: true },
    nameOnMedia     : { type: String, required: true },
    nameProduct     : { type: String, default: "-" },
    inventor        : { type: [String], required: true },
    major           : { type: String, required: true },
    intelProp       : { type: String, default: "-" },
    industryType    : { type: String, required: true },
    description     : { type: String, required: true },
    highlight       : { type: [String], default: [] },
    techReadiness   : { type: String, required: true },
    coop            : { type: [String], required: true },
    ipType          : { type: String, required: true },
    filePath        : { type: [String], default: []},
    link            : { type: String, default: []},
    status          : { type: Number, default: "active"},
});

var research = mongoose.model('research', researchModel, 'research');
module.exports = research;
