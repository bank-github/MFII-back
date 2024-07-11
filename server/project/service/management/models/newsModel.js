'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsModel = new Schema({
    filePath            : { type: Array, required: true },
    linkVideo           : { type: Array, required: true },
    linkImage           : { type: Array, required: true },
<<<<<<< HEAD
    linkPage            : { type: String, required: true }

=======
    linkPage            : { type: String, required: true}
>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f
});

var news = mongoose.model('news', newsModel, 'news');
module.exports = news;
