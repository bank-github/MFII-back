'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsModel = new Schema({
    imagePath           : { type: Array, require: true},
    filePath            : { type: Array, required: true },
    link                : { type: Array, required: true }
});

var news = mongoose.model('news', newsModel, 'news');
module.exports = news;
