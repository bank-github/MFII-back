var regulationModel = require('../models/regulationModel');

exports.getRegulationController = async function (query) {
    return new Promise((resolve, reject) => {
        regulationModel
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

exports.getsRegulationController = async function (query) {
    return new Promise((resolve, reject) => {
        regulationModel
            .find(query, { __v: 0 })
            .sort({ updatedAt: -1 })
            .then(doc => {
                var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.addRegulationController = async function (data) {
    return new Promise((resolve, reject) => {
        var regulationModels = new regulationModel(data);
        regulationModels.save()
            .then(() => {
                var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.deleteRegulationController = async function (query, id) {
    return new Promise((resolve, reject) => {
        regulationModel
            .findOneAndDelete(query)
            .then(async deleteregulation => {
                // find regulation and delete
                if (deleteregulation) {
                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no regulation in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};

exports.updateFileRegulationController = async function (query, update) {
    return new Promise((resolve, reject) => {
        regulationModel
            .findOneAndUpdate(query, update, { new: true }) // เพิ่ม { new: true } เพื่อให้ได้ผลลัพธ์ที่อัปเดตล่าสุด
            .then(async updateregulation => {
                if (updateregulation) {
                    // ตรวจสอบว่าถ้า filePath เป็น array ว่าง ให้เพิ่ม uploads/image/noImage.jpg
                    if (updateregulation.filePath.length === 0) {
                        await regulationModel.updateOne(query, { $push: { filePath: 'uploads/image/noImage.jpg' } });
                    } else {
                        const hasNoImageFile = updateregulation.filePath.includes('uploads/image/noImage.jpg');
                        const hasOtherImageFile = updateregulation.filePath.some(file => (file.startsWith('uploads\\image\\') || file.startsWith('uploads/image/')) && file !== 'uploads/image/noImage.jpg');
                        
                        if (!hasNoImageFile && !hasOtherImageFile) {
                            // เพิ่ม uploads/image/noImage.jpg เข้าไปใน array filePath
                            await regulationModel.updateOne(query, { $push: { filePath: 'uploads/image/noImage.jpg' } });
                        } else if (hasNoImageFile && hasOtherImageFile) {
                            // ลบ uploads/image/noImage.jpg จาก array filePath
                            await regulationModel.updateOne(query, { $pull: { filePath: 'uploads/image/noImage.jpg' } });
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




exports.updateDataRegulationController = async function (query, update) {
    return new Promise((resolve, reject) => {
        regulationModel
            .findByIdAndUpdate(query._id, update, { new: true })
            .then(updateregulation => {
                // find regulation and delete
                if (updateregulation) {
                    var resInfo = { result: { updateregulation }, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no regulation in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};



