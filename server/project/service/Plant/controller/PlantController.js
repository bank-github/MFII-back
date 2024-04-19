var mongo = require('mongodb');
var objSchema = require('../models/PlantModel');

exports.getDetailController = async function (query) {
    return new Promise((resolve, reject) => {
        objSchema
            .findOne({ query })
            // .sort("coin")
            // .populate([
            //     // {path : "address.province"},
            //     // {path : "address.district"},
            //     // {path : "bankInfo.bankName"}
            // ])
            .lean()
            .exec().then(doc => {
                // if (doc == null) {
                //     var rejInfo = { error: doc, code: { codeNO: 404, description: 40401 } };
                //     reject(rejInfo);
                // } else {
                //     var resInfo = { result: doc, code: { codeNO: 200, description: 200 } };
                //     resolve(resInfo);
                // }
            }).catch(err => {
                // var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } }
                // reject(rejInfo);
            });
    });
}
exports.getPlantsController = async function (query) {
    return new Promise((resolve, reject) => {
        objSchema
            .find({ $or: query })
            // .sort({ _id: -1 })
            .lean()
            .exec().then(doc => {
                // console.log(doc.length)
                if (doc.length == 0) {
                    var rejInfo = { error: doc, code: { codeNO: 404, description: 40401 } };
                    reject(rejInfo);
                } else {
                    var resInfo = { result: doc, code: { codeNO: 200, description: 200 } };
                    resolve(resInfo);
                }
            }).catch(err => {
                var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } }
                reject(rejInfo);
            });
    });
}
exports.addPlantController = async function (data) {
    return new Promise((resolve, reject) => {
        var objSchemas = new objSchema(data);
        objSchemas.save()
            .then(doc => {
                var resInfo = { result: doc, code: { codeNO: 200, description: 200 } };
                resolve(resInfo);
            }).catch(err => {
                var rejInfo = { error: err, code: { codeNO: 500, description: 50003 } }
                reject(rejInfo);
            });
    });
}
exports.onUpdate = async function (query, data) {
    return new Promise((resolve, reject) => {
        objSchema
            .findOneAndUpdate(query, data, { new: true, returnOriginal: false, upsert: true })
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
    });
}
exports.onDelete = async function (query) {

    return new Promise((resolve, reject) => {
        objSchema
            .remove(query)
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
    });
}



