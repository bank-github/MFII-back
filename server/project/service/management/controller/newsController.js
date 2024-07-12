var mongo = require('mongodb');
var newsModel = require('../models/newsModel');

exports.getNewsController = async function (query) {
    return new Promise((resolve, reject) => {
        newsModel
            .findOne(query, { __v: 0 })
            .then(doc => {
                if (doc == null) {
                    var resInfo = { result: {}, code: { codeNo: 404, description: 40401 } };
                    reject(resInfo);
                }
                var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.getsNewsController = async function () {
    return new Promise((resolve, reject) => {
        newsModel
            .find({}, { __v: 0 })
            .sort({ _id: -1 })
            .then(doc => {
                var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.addNewsController = async function (data) {
    return new Promise((resolve, reject) => {
        var newsModels = new newsModel(data);
        newsModels.save()
            .then(() => {
                var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.onUpdate = async function (query, data) {
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
            }).catch(err => {
                reject(err);
            });
    });
};

exports.deleteNewsController = async function (query) {
    return new Promise((resolve, reject) => {
        newsModel
            .findOneAndDelete(query)
            .then(deleteNews => {
                // find news and delete
                if (deleteNews) {
                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no news in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};

exports.updateNewsController = async function (query, update) {
    return new Promise((resolve, reject) => {
        newsModel
        .findByIdAndUpdate(query._id, update, { new: true })
            .then(updateNews => {
                // find News and delete
                if (updateNews) {
                    var resInfo = { result: {updateNews}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no News in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};
