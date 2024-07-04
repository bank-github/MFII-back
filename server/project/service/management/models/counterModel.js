'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterModel = new Schema({
     totalAccess: { type: Number, default: 0 },
     yearlyAccess: { type: Map, of: Number, default: {} },
     monthlyAccess: { type: Map, of: Number, default: {} },
     dailyAccess: { type: Map, of: Number, default: {} },
     productAccess: { type: Map, of: Number, default: {} },
   }, { timestamps: true });

var counter = mongoose.model('counter', counterModel, 'counter');
module.exports = counter;
