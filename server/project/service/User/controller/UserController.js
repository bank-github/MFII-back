var mongo = require('mongodb');
var UserModel = require('../models/UserModel');
var bcrypt = require('bcrypt');
const saltRound = 10; //for hash password

exports.loginController = async function (query) {
    return new Promise((resolve, reject) => {
        UserModel
            .findOne(query.query)
            .lean()
            .exec().then(doc => {
                if (doc == null) {
                    // user not found
                    var rejInfo = { error: {}, code: { codeNO: 404, description: 40402 } };
                    reject(rejInfo);
                }
                else {
                    bcrypt.compare(query.Password, doc.Password, (err, result) => {
                        if (err) {
                            // server compare error
                            var rejInfo = { error: err, code: { codeNO: 500, description: 50000 } };
                            reject(rejInfo);
                        }
                        else if (result) {
                            // login success
                            var resInfo = { status: result, code: { codeNO: 200, description: 20000 } }
                            resolve(resInfo);
                        } else {
                            // login failed (password miss match)
                            var rejInfo = { error: {}, code: { codeNO: 401, description: 401 } };
                            reject(rejInfo);
                        }
                    })
                }
            }).catch(err => {
                // server find error
                var rejInfo = { error: err, code: { codeNO: 500, description: 50002 } };
                reject(rejInfo);
            });
    });
}
exports.onQuerys = async function (query) {
    return new Promise((resolve, reject) => {
        UserModel
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
exports.createAdminController = async function (data) {
    return new Promise((resolve, reject) => {
        var query = { UserName: data.UserName }
        UserModel.findOne(query)
            .lean()
            .exec().then(doc => {
                if (doc != null) {
                    // user already exit
                    var rejInfo = { error: doc.UserName, code: { codeNO: 200, description: 20001 } };
                    reject(rejInfo);
                }
                else {
                    bcrypt.hash(data.Password, saltRound, (err, hash) => {
                        if (err) {
                            // hash password error
                            var rejInfo = { error: err, code: { codeNO: 500, description: 50000 } };
                            reject(rejInfo);
                        } else {
                            data.Password = hash;
                            var UserModels = new UserModel(data);
                            UserModels.save()
                                .then(() => {
                                    var resInfo = { data: {}, code: { codeNO: 200, description: 20000 } };
                                    resolve(resInfo);
                                }).catch(err => {
                                    // save data error
                                    var rejInfo = { error: err, code: { codeNO: 500, description: 50003 } };
                                    reject(rejInfo);
                                });
                        }
                    });
                }
            }).catch(err => {
                // find data error
                var rejInfo = { error: err, code: { codeNO: 500, description: 50003 } };
                reject(rejInfo);
            });
    });
}
exports.onUpdate = async function (query, data) {
    return new Promise((resolve, reject) => {
        UserModel
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
        UserModel
            .remove(query)
            .lean()
            .exec().then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
    });
}



