var mongo = require('mongodb');
var messageModel = require('../models/messageModel');

exports.onQuery = async function (query) {
    return new Promise((resolve, reject) => {
        messageModel
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
            }).catch(err => {
                reject(err);
            });
    });
}
exports.onQuerys = async function (query) {
    return new Promise((resolve, reject) => {
        messageModel
            .find(query)
            .sort({ _id: -1 })
            .populate([
                // {path : "address.province"},
                // {path : "address.district"},
                // {path : "bankInfo.bankName"}
            ])
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
    });
}
exports.onCreate = async function (data) {
    return new Promise((resolve, reject) => {
        var messageModels = new messageModel(data);
        messageModels.save()
            .then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
    });
}
exports.onUpdate = async function (query, data) {
    return new Promise((resolve, reject) => {
        messageModel
            .findOneAndUpdate(query, data, { new: true, returnOriginal: false, upsert: true })
            .populate([
                // {path : "address.province"},
                // {path : "address.district"},
                // {path : "bankInfo.bankName"}
            ])
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
        messageModel
            .remove(query)
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
    });
}



