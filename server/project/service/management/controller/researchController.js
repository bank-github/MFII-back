var mongo = require('mongodb');
var researchModel = require('../models/researchModel');

exports.getResearchController = async function (query) {
    return new Promise((resolve, reject) => {
        researchModel
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
}
exports.getsResearchController = async function () {
    return new Promise((resolve, reject) => {
        researchModel
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
}
exports.addResearchController = async function (data) {
    return new Promise((resolve, reject) => {
        var researchModels = new researchModel(data);
        researchModels.save()
            .then(() => {
                var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
}
exports.deleteResearchController = async function (query) {
    return new Promise((resolve, reject) => {
        researchModel
            .findOneAndDelete(query)
            .then(deleteResearch => {
                // find Research and delete
                if (deleteResearch) {
                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no Research in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
}
exports.updateFileResearchController = async function (query,update) {
    return new Promise((resolve, reject) => {
        researchModel
            .findOneAndUpdate(query,update)
            .then(updateResearch => {
                // find Research and delete
                if (updateResearch) {
                    var resInfo = { result: {updateResearch}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no Research in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
}




