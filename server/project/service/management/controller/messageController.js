var mongo = require('mongodb');
var messageModel = require('../models/messageModel');
const mongoose = require('mongoose');

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
                        businessType: 1,
                        businessName: 1,
                        interestTech: 1,
                        usesScope:1,
                        messages:1,
                        email: '$user_info.email',       // Flatten the user_info fields
                        firstName: '$user_info.firstName',
                        lastName: '$user_info.lastName',
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

exports.getMesController = async function (messageReplyId) {
    return new Promise((resolve, reject) => {
        messageModel
            .aggregate([
                {
                    $match: { messageReply: new mongoose.Types.ObjectId(messageReplyId) }
                },
                {
                    $lookup: {
                        from: 'user',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user_info'
                    }
                },
                {
                    $unwind: '$user_info'
                },
                {
                    $project: {
                        _id: 0,
                        messageReply: 1,
                        messages: 1,
                        newMessage:1,
                    }
                }
            ])
            .exec()
            .then(doc => {
                if (doc == null || doc.length === 0) {
                    var rejInfo = { error: "No message found", code: { codeNO: 404, description: 40401 } };
                    reject(rejInfo);
                } else {
                    var resInfo = { result: doc, code: { codeNO: 200, description: 200 } };
                    resolve(resInfo);
                }
            }).catch(err => {
                var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } };
                reject(rejInfo);
            });
    });
};

exports.updateMesController = async function (messageReplyId, newMessage) {
    return new Promise((resolve, reject) => {
        messageModel.findOneAndUpdate(
            { messageReply: new mongoose.Types.ObjectId(messageReplyId) },
            { $set: { newMessage: newMessage } },
            { new: true }
        ).exec().then(doc => {
            if (doc == null) {
                var rejInfo = { error: "No message found", code: { codeNO: 404, description: 40401 } };
                reject(rejInfo);
            } else {
                var resInfo = { result: [doc], code: { codeNO: 200, description: 200 } };
                resolve(resInfo);
            }
        }).catch(err => {
            var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } };
            reject(rejInfo);
        });
    });
};






// exports.onQuerys = async function (query) {
//     return new Promise((resolve, reject) => {
//         messageModel
//             .find(query)
//             .sort({ _id: -1 })
//             .populate([
//                 // {path : "address.province"},
//                 // {path : "address.district"},
//                 // {path : "bankInfo.bankName"}
//             ])
//             .lean()
//             .exec().then(doc => {
//                 resolve(doc);
//             }).catch(err => {
//                 reject(err);
//             });
//     });
// }

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

exports.updateRequestController = async (query, data) => {
    return new Promise((resolve, reject) => {
        messageModel.findByIdAndUpdate(query, data, { new: true })
            .then(updatedRequest => {
                if (!updatedRequest) {
                reject({ error: {}, code: { codeNO: 404, description: 40402 } });
                }
                var resInfo = { result: updatedRequest, code: { codeNO: 200, description: 20000 } };
                resolve(resInfo);
            })
            .catch(error => {
                console.error('Error in updateRequestController:', error);
                var rejInfo = { error: error, code: { codeNO: 500, description: 50000 } };
                reject(rejInfo);
            });
    });
};

exports.deleteRequestController = async function (query) {
    return new Promise((resolve, reject) => {
        var messageModels = new messageModel(query);
        messageModels
            .deleteOne(query)
            .exec()
            .then(result => {
                if (result.deletedCount === 0) {
                    var rejInfo = { error: {} , code: { codeNO: 404, description: 40402 } };
                    return reject(rejInfo);
                }
                var resInfo = { result: result, code: { codeNO: 200, description: 200 } };
                resolve(resInfo);
            }).catch(err => {
                var rejInfo = { error: err, code: { codeNO: 500, description: 50005 } };
                reject(rejInfo);
            });
    });
}



