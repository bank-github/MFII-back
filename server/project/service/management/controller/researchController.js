var researchModel = require('../models/researchModel');
var counterModel = require('../models/counterModel');

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
};

exports.getsResearchController = async function (query) {
    return new Promise((resolve, reject) => {
        researchModel
            .find(query, { __v: 0 })
            .sort({ nameMedia: -1 })
            .then(doc => {
                var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

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
};

exports.deleteResearchController = async function (query, id) {
    return new Promise((resolve, reject) => {
        researchModel
            .findOneAndDelete(query)
            .then(async deleteResearch => {
                // find Research and delete
                if (deleteResearch) {
                    // delete counter product that deleted
                    const counter = await counterModel.findOne();
                    if (counter) {
                        // Remove the specific ID from productAccess
                        if (counter.productSessionIds.has(id)) {
                            counter.productSessionIds.delete(id);
                        }

                        // Remove the specific ID from productSessionIds
                        if (counter.productAccess.has(id)) {
                            counter.productAccess.delete(id);
                        }
                        // Save the updated counter model document
                        await counter.save();
                    }
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
};

exports.updateFileResearchController = async function (query, update) {
    return new Promise((resolve, reject) => {
        researchModel
            .findOneAndUpdate(query, update)
            .then(updateResearch => {
                // find Research and delete
                if (updateResearch) {
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
};

exports.updateDataResearchController = async function (query, update) {
    return new Promise((resolve, reject) => {
        researchModel
            .findByIdAndUpdate(query._id, update, { new: true })
            .then(updateResearch => {
                // find Research and delete
                if (updateResearch) {
                    var resInfo = { result: { updateResearch }, code: { codeNo: 200, description: 20000 } }
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
};
