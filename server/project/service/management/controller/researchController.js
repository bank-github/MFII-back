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
};

exports.updateFileResearchController = async function (query,update) {
    return new Promise((resolve, reject) => {
        researchModel
            .findOneAndUpdate(query, update, { new: true }) // เพิ่ม { new: true } เพื่อให้ได้ผลลัพธ์ที่อัปเดตล่าสุด
            .then(async updateResearch => {
                if (updateResearch) {
                    // ตรวจสอบว่าไม่มีไฟล์ใดใน filePath ที่มีคำนำหน้า uploads/image/
                    const hasImageFile = updateResearch.filePath.some(file => file.startsWith('uploads/image/'));

                    if (!hasImageFile) {
                        // เพิ่ม uploads/image/noImage.jpg เข้าไปใน array filePath
                        await researchModel.updateOne(query, { $push: { filePath: 'uploads/image/noImage.jpg' } });
                    } else {
                        // ลบ uploads/image/noImage.jpg จาก array filePath
                        await researchModel.updateOne(query, { $pull: { filePath: 'uploads/image/noImage.jpg' } });
                    }

                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                    resolve(resInfo);
                } else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            })
            .catch(err => {
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
};



