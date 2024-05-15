'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureModel = new Schema({
    PlantId     : {type:String, require: true},
    Image      : {type: Array}

});

var Picture = mongoose.model('Picture', PictureModel, 'Picture');
module.exports = Picture;
