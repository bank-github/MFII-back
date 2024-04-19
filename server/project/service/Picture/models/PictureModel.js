'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureModel = new Schema({
    PlantID     : {type:String, require: true},
    Imgage      : {type: Array}

});

var Picture = mongoose.model('Picture', PictureModel, 'Picture');
module.exports = Picture;
