var mongo = require('mongodb');
var userModel = require('../models/userModel');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRound = 10;
const secretKey = "MFII-project-2023"
exports.createUserController = async function (data) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ email: data.email })
            .then((exitUser) => {
                // user already exit in database
                if (exitUser) {
                    reject({ error: {}, code: { codeNo: 403, description: 40301 } });
                }
                // user not exit in database
                else {
                    //hash password
                    bcrypt.hash(data.password, saltRound, (err, hash) => {
                        if (err) {
                            reject({ error: err, code: { codeNo: 500, description: 50000 } });
                        } else {
                            //assign password to new hash password
                            data.password = hash
                            var userData = new userModel(data);
                            //add data to database
                            userData.save()
                                .then(() => {
                                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                                    resolve(resInfo);
                                }).catch(err => {
                                    var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                                    reject(resInfo);
                                });
                        }
                    })
                }
            })
            .catch((err) => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            })
    })
};
exports.loginUserController = async function (data) {
    return new Promise((resolve, reject) => {
        userModel
            .findOne(data.query, { __v: 0 })
            .then(doc => {
                // user not found
                if (doc == null) {
                    var resInfo = { error: {}, code: { codeNo: 404, description: 40402 } };
                    reject(resInfo);
                } else {
                    // compare password to login
                    bcrypt.compare(data.password, doc.password, (err, result) => {
                        if (err) {
                            var resInfo = { error: err, code: { codeNo: 500, description: 50000 } };
                            reject(resInfo);
                        } else if (result) {
                            // // create new variable to keep data without password to docNoPassword
                            // const { password, ...docNoPassword } = doc.toObject();
                            // //create token for login user for 1 hr
                            const token = jwt.sign({ userId: doc._id, role: doc.role }, secretKey, { expiresIn: '1h' });
                            // docNoPassword.token = token;
                            var resInfo = { result: { token: token }, code: { codeNo: 200, description: 20000 } };
                            resolve(resInfo);
                        } else {
                            var resInfo = { error: {}, code: { codeNo: 401, description: 40105 } };
                            reject(resInfo);
                        }
                    })
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};
exports.getsUserController = async function (query) {
    console.log(query);
    return new Promise((resolve, reject) => {
        userModel
            .find(query, { password: 0, __v: 0 })
            .sort({ firstName: 1 })
            .then(doc => {
                if (doc.length == 0) {
                    var resInfo = { error: {}, code: { codeNo: 404, description: 40402 } };
                    reject(resInfo);
                }
                var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } }
                resolve(resInfo);
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};
exports.getUserController = async function (query) {
    return new Promise((resolve, reject) => {
        userModel
            .findOne(query, { password: 0, __v: 0 })
            .then(doc => {
                if (doc == null) {
                    var resInfo = { error: {}, code: { codeNo: 404, description: 40402 } };
                    reject(resInfo);
                }
                var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } }
                resolve(resInfo);
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};
exports.deleteStaffContoller = async function (query) {
    return new Promise((resolve, reject) => {
        userModel
            .findOneAndDelete(query)
            .then(deleteUser => {
                // find user and delete
                if (deleteUser) {
                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no user in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};
exports.updateUserController = async function (query, data) {
    return new Promise((resolve, reject) => {
        userModel
            // find data and update with sent docUpdate data not original and when not found no add data
            .findOneAndUpdate(query, data, { new: true, returnOriginal: false, upsert: false }, { password: 0 })
            .then(doc => {
                // if can find and update data
                if (doc) {
                    // assign newDoc to keep data without password, role, __v
                    const { password, role, __v, ...newDoc } = doc.toObject();
                    var resInfo = { result: newDoc, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                // no update data
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }

            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};
exports.updateStaffController = async function (query, data) {
    return new Promise((resolve, reject) => {
        userModel
            // find data and update with sent docUpdate data not original and when not found no add data
            .findOneAndUpdate(query, data, { new: true, returnOriginal: false, upsert: false }, { password: 0 })
            .then(doc => {
                // if can find and update data
                if (doc) {
                    // assign newDoc to keep data without password, role, __v
                    const { password, role, __v, ...newDoc } = doc.toObject();
                    var resInfo = { result: newDoc, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                // no update data
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }

            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};



