var mongo = require('mongodb');
var objSchema = require('../models/userModel');
var bcrypt = require('bcrypt');
const saltRound = 10;

exports.loginUserController = async function (data) {
    return new Promise((resolve, reject) => {
        var query = { 'username': data.username }
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
                // console.log(doc);
                if (doc == null) {
                    var resData = { code: { status: 404, typeCode: 40402 } };
                    // console.log(resData);
                    reject(resData);
                } else {
                    bcrypt.compare(data.password, doc.password, (err, result) => {
                        if (err) {
                            var resData = { err: err, code: { status: 500, typeCode: 50000 } };
                            reject(resData);
                        } else if (result) {
                            var resData = { code: 200 };
                            resolve(resData);
                        } else {
                            var resData = { code: { status: 401, typeCode: 40105 } };
                            reject(resData);
                        }
                    })
                }
            }).catch(err => {
                var resData = { err: err, code: { status: 500, typeCode: 50000 } };
                reject(resData);
            });
    });
}
exports.onQuerys = async function () {
    return new Promise((resolve, reject) => {
        objSchema
            .find()
            .sort({ _id: -1 })
            .populate([
                // {path : "address.province"},
                // {path : "address.district"},
                // {path : "bankInfo.bankName"}
            ])
            .lean()
            .exec().then(doc => {
                var resData = {doc: doc, code: 200}
                resolve(resData);
            }).catch(err => {
                var resData = { err: err, code: { status: 500, typeCode: 50000 } };
                reject(resData);
            });
    });
}
exports.onCreate = async function (data) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data.password, saltRound, (err, hash) => {
            if (err) {
                reject({ 'code': 50003 })
            } else {
                data.password = hash
                // console.log(data);
                var objSchemas = new objSchema(data);
                objSchemas.save()
                    .then(doc => {
                        var resData = { doc, 'code': 200 };
                        // console.log(resData);
                        resolve(resData);
                    }).catch(err => {
                        var resErr = { err, 'code': 50003 }
                        reject(resErr);
                    });
            }
        })
    });
}
exports.onUpdate = async function (query, data) {
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
            }).catch(err => {
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
            }).catch(err => {
                reject(err);
            });
    });
}



