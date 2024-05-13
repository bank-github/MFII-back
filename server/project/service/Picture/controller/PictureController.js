var mongo = require('mongodb');
var objSchema = require('../models/PictureModel');

exports.getPlantImage = async function (query) {
    return new Promise((resolve, reject) => {
        objSchema
            .findOne(query)
            // // .sort("coin")
            // .populate([
            //     // {path : "address.province"},
            //     // {path : "address.district"},
            //     // {path : "bankInfo.bankName"}
            // ])
            .lean()
            .exec().then(doc => {
                var resInfo = { result: doc, code: { codeNO: 200, description: 200 } };
                    resolve(resInfo);
            }).catch(err =>{
                var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } }
                reject(rejInfo);
            });
    });
}
exports.onQuerys = async function (query) {
    return new Promise((resolve, reject) => {
        objSchema
            .find(query)
            .sort({_id:-1})
            .populate([
                // {path : "address.province"},
                // {path : "address.district"},
                // {path : "bankInfo.bankName"}
            ])
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err =>{
                reject(err);
            });
    });
}
exports.addPlantImage = async function (data) {
    return new Promise((resolve, reject) => {
        var objSchemas = new objSchema(data);
        objSchemas.save()
        .then(doc => {
            var resInfo = { result: doc, code: { codeNO: 200, description: 200 } };
            resolve(resInfo);
        }).catch(err =>{
            var rejInfo = { error: err, code: { codeNO: 500, description: 50003 } }
            reject(rejInfo);
        });
    });
}
exports.onUpdate = async function (query,data) {
    return new Promise((resolve, reject) => {
        objSchema
            .findOneAndUpdate(query, data, { new: true, returnOriginal: false, upsert: true })
            .populate([
                // {path : "address.province"},
                // {path : "address.district"},
                // {path : "bankInfo.bankName"}
            ])
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err =>{
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
            }).catch(err =>{
                reject(err);
            });
    });
}



