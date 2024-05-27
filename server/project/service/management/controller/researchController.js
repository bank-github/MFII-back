var mongo = require('mongodb');
var researchModel = require('../models/researchModel');

exports.onQuery = async function (query) {
    return new Promise((resolve, reject) => {
        researchModel
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
        researchModel
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
        var objSchemas = new researchModel(data);
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
        researchModel
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
        researchModel
            .remove(query)
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err =>{
                reject(err);
            });
    });
}



