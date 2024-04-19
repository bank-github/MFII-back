'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlantModel = new Schema({
    Name            : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    OtherName       : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    SciName         : {
        ScienName   : {type: String, default: null},
        AuthorName  : {type: String, default: null},
    },
    FamName         : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    Character       : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    Ecology         : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    Distribution    : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    Utilization     : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    FloweringTime   : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    FrutingTime     : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    Location        : {
        TH          : {type: String, default: null},
        EN          : {type: String, default: null},
    },
    CommonName      : {type: String, default: null}
    // Name      : {type: String, default: null},
    // SciName      : {type: String, default: null},
    // FamName      : {type: String, default: null},
    // OtherName      : {type: String, default: null},
    // Character      : {type: String, default: null}
});

var Plant = mongoose.model('Plant', PlantModel, 'Plant');
module.exports = Plant;
