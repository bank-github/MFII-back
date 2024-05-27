var mongo = require('mongodb');
var objSchema = require('../models/Setting_Status.model');

exports.onQuery = async function (query) {
    return new Promise((resolve, reject) => {
        objSchema
            .findOne(query)
            // .sort("coin")
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
exports.onCreate = async function (data) {
    return new Promise((resolve, reject) => {
        var objSchemas = new objSchema(data);
        objSchemas.save()
        .then(doc => {
            resolve(doc);
        }).catch(err =>{
            reject(err);
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



