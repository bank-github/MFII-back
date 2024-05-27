var mongo = require('mongodb');
var newsModel = require('../models/newsModel');

exports.onQuery = async function (query) {
    return new Promise((resolve, reject) => {
        newsModel
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
        newsModel
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
        var newsModels = new newsModel(data);
        newsModels.save()
        .then(doc => {
            resolve(doc);
        }).catch(err =>{
            reject(err);
        });
    });
}
exports.onUpdate = async function (query,data) {
    return new Promise((resolve, reject) => {
        newsModel
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
        newsModel
            .remove(query)
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err =>{
                reject(err);
            });
    });
}



