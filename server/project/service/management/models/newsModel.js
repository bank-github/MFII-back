'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsModel = new Schema({
    filePath            : { type: Array, required: true },
    linkVideo           : { type: Array, required: true },
    linkImage           : { type: Array, required: true },
    linkPage            : { type: String, required: true}
});

var news = mongoose.model('news', newsModel, 'news');
module.exports = news;
