var mongo = require('mongodb');
var messageModel = require('../models/messageModel');

exports.getRequestController = async function () {
    return new Promise((resolve, reject) => {
        messageModel
            // .find()
            // .populate('userId', 'email firstName lastName')
            // .populate({
            //     path: 'userId',
            //     select: '-_id email firstName lastName' // Exclude _id and include email, firstName, lastName
            // })
            .aggregate([
                {
                    $lookup: {
                        from: 'user',             // The name of the collection to join
                        localField: 'userId',      // Field from the messageModel
                        foreignField: '_id',       // Field from the user collection
                        as: 'user_info'            // The name of the array to add the matched user
                    }
                },
                {
                    $unwind: '$user_info'          // Deconstruct the array field to object
                },
                {
                    $project: {
                        _id: 1,
                        BusinessType: 1,
                        Description: 1,
                        Scope: 1,
                        email: '$user_info.email',       // Flatten the user_info fields
                        firstName: '$user_info.firstName',
                        lastName: '$user_info.lastName'
                    }
                }
            ])
            .exec()
            .then(doc => {
                if (doc == null) {
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
exports.createRequestController = async function (data) {
    return new Promise((resolve, reject) => {
        var messageModels = new messageModel(data);
        messageModels.save()
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



