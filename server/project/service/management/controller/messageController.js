var mongo = require('mongodb');
var messageModel = require('../models/messageModel');
var userController = require('../controller/userController');
exports.getRequestController = async function (query) {
    return new Promise((resolve, reject) => {
        messageModel
            .aggregate([
                {
                    $match: query
                },
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
                        usesScope: 1,
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

// exports.getMessageReplyController = async function (messageId) {
//     return new Promise((resolve, reject) => {
//         messageModel.findById(messageId,)
//             .populate('messageReply.user', 'messages firstName lastName')
//             .then(doc => {
//                 if (doc == null) {
//                     var rejInfo = { error: {}, code: { codeNO: 404, description: 40401 } };
//                     reject(rejInfo);
//                 } else {
//                     let newMesReply = []
//                     doc.messageReply.forEach(reply => {
//                         const { _id, ...newReply } = reply.toObject();
//                         newMesReply.push(newReply);
//                     })
//                     var resInfo = { result: newMesReply, code: { codeNO: 200, description: 200 } };
//                     resolve(resInfo);
//                 }
//             }).catch(err => {
//                 var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } };
//                 reject(rejInfo);
//             });
//     });
// };

exports.getMessageReplyController = async function (query) {
    return new Promise((resolve, reject) => {
        messageModel
            .aggregate([
                {
                    $match: query
                },
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
                        usesScope: 1,
                        messageReply: 1,
                        email: '$user_info.email',       // Flatten the user_info fields
                        firstName: '$user_info.firstName',
                        lastName: '$user_info.lastName',
                    }
                }
            ])
            .exec()
            .then(doc => {
                if (doc.length == 0) {
                    var rejInfo = { error: 'Message not found', code: { codeNO: 404, description: 40401 } };
                    reject(rejInfo);
                } else {
                    let newMesReply = []
                    doc[0].messageReply.forEach(async reply => {
                        const { _id, ...newReply } = reply;
                        newMesReply.push(newReply);
                    })
                    doc.messageReply = newMesReply;
                    var resInfo = { result: doc, code: { codeNO: 200, description: 200 } };
                    resolve(resInfo);
                }
            }).catch(err => {
                var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } };
                reject(rejInfo);
            });
    });
};
exports.updateMessageReplyController = async function (messageId, messageReplyData) {
    return new Promise((resolve, reject) => {
        console.log("Mes ID: ", messageId);
        messageModel.findByIdAndUpdate(
            messageId,
            { $push: { messageReply: messageReplyData } },
            { new: true }
        ).then(doc => {
            if (!doc) {
                var rejInfo = { error: {}, code: { codeNO: 404, description: 40401 } };
                reject(rejInfo);
            } else {
                var resInfo = { result: {}, code: { codeNO: 200, description: 200 } };
                resolve(resInfo);
            }
        }).catch(err => {
            var rejInfo = { error: err, code: { codeNO: 500, description: 50003 } };
            reject(rejInfo);
        });
    });
}

exports.createRequestController = async function (data) {
    return new Promise((resolve, reject) => {
        var messageModels = new messageModel(data);
        messageModels.save()
            .then(() => {
                var resInfo = { result: {}, code: { codeNO: 200, description: 200 } };
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
                var resInfo = { result: {}, code: { codeNO: 200, description: 20000 } };
                resolve(resInfo);
            })
            .catch(error => {
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
                    var rejInfo = { error: {}, code: { codeNO: 404, description: 40402 } };
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
