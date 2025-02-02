'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docsModel = new Schema({
    mainType            : { type: String, required: true },
    subType             : { type: String, required: true },
    link                : { type: String, default: '-' },
    filePath            : { type: String, default: '-'}
});

var docs = mongoose.model('docs', docsModel, 'docs');
module.exports = docs;
