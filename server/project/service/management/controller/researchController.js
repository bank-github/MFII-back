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
                    //delete counter product ID from counter
                    const counter = await counterModel.findOne();
                    if (counter) {
                        //delete research ID that deleted in research
                        if (counter.researchAccess.has(id)) {
                            counter.researchAccess.delete(id);
                        }
                        if (counter.researchSessionIds.has(id)) {
                            counter.researchSessionIds.delete(id);
                        }
                    }
                    counter.save();
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
            .findOneAndUpdate(query, update, { new: true }) // เพิ่ม { new: true } เพื่อให้ได้ผลลัพธ์ที่อัปเดตล่าสุด
            .then(async updateResearch => {
                if (updateResearch) {
                    // ตรวจสอบว่าถ้า filePath เป็น array ว่าง ให้เพิ่ม uploads/image/noImage.jpg
                    if (updateResearch.filePath.length === 0) {
                        await researchModel.updateOne(query, { $push: { filePath: 'uploads/image/noImage.jpg' } });
                    } else {
                        const hasImageFile = updateResearch.filePath.some(file => file.startsWith('uploads\\image\\') || file.startsWith('uploads/image/'));
                        const hasNoImageFile = updateResearch.filePath.includes('uploads/image/noImage.jpg');
                        const hasPdfFile = updateResearch.filePath.some(file => file.startsWith('uploads\\pdf\\') || file.startsWith('uploads/pdf/'));
                        
                        if (!hasNoImageFile && !hasImageFile) {
                            // เพิ่ม uploads/image/noImage.jpg เข้าไปใน array filePath
                            await researchModel.updateOne(query, { $push: { filePath: 'uploads/image/noImage.jpg' } });
                        } else if (hasImageFile && hasNoImageFile && !hasPdfFile) {
                            // ลบ uploads/image/noImage.jpg จาก array filePath
                            await researchModel.updateOne(query, { $pull: { filePath: 'uploads/image/noImage.jpg' } });
                        }
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



