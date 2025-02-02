var mongo = require('mongodb');
var docsModel = require('../models/docsModel');

exports.getDocsController = async function (query) {
    return new Promise((resolve, reject) => {
        docsModel
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

exports.getsDocsController = async function () {
    return new Promise((resolve, reject) => {
        docsModel
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

exports.addDocsController = async function (data) {
    return new Promise((resolve, reject) => {
        var docsModels = new docsModel(data);
        docsModels.save()
            .then(() => {
                var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.updateDocsController = async function (query, update) {
    return new Promise((resolve, reject) => {
        docsModel
            .findByIdAndUpdate(query._id, update, { new: true })
            .then(updateDocs => {
                // find docs and update
                if (updateDocs) {
                    var resInfo = { result: { updateDocs }, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no docs in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};

exports.deleteDocsController = async function (query) {
    return new Promise((resolve, reject) => {
        docsModel
            .findOneAndDelete(query)
            .then(deleteDocs => {
                // find docs and delete
                if (deleteDocs) {
                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no docs in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};



