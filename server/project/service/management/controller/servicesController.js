var servicesModel = require('../models/servicesModel');

exports.getServicesController = async function (query) {
    return new Promise((resolve, reject) => {
        servicesModel
            .find(query, { __v: 0 })
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

exports.getsServicesController = async function (query) {
    return new Promise((resolve, reject) => {
        servicesModel
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

exports.addServicesController = async function (data) {
    return new Promise((resolve, reject) => {
        var servicesModels = new servicesModel(data);
        servicesModels.save()
            .then(() => {
                var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.deleteServicesController = async function (query, id) {
    return new Promise((resolve, reject) => {
        servicesModel
            .findOneAndDelete(query)
            .then(async deleteservices => {
                // find services and delete
                if (deleteservices) {
                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no services in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};

exports.updateFileServicesController = async function (query, update) {
    return new Promise((resolve, reject) => {
        servicesModel
            .findOneAndUpdate(query, update, { new: true }) // เพิ่ม { new: true } เพื่อให้ได้ผลลัพธ์ที่อัปเดตล่าสุด
            .then(async updateservices => {
                if (updateservices) {
                    // ตรวจสอบว่าถ้า filePath เป็น array ว่าง ให้เพิ่ม uploads/image/noImage.jpg
                    if (updateservices.filePath.length === 0) {
                        await servicesModel.updateOne(query, { $push: { filePath: 'uploads/image/noImage.jpg' } });
                    } else {
                        const hasNoImageFile = updateservices.filePath.includes('uploads/image/noImage.jpg');
                        const hasOtherImageFile = updateservices.filePath.some(file => (file.startsWith('uploads\\image\\') || file.startsWith('uploads/image/')) && file !== 'uploads/image/noImage.jpg');
                        
                        if (!hasNoImageFile && !hasOtherImageFile) {
                            // เพิ่ม uploads/image/noImage.jpg เข้าไปใน array filePath
                            await servicesModel.updateOne(query, { $push: { filePath: 'uploads/image/noImage.jpg' } });
                        } else if (hasNoImageFile && hasOtherImageFile) {
                            // ลบ uploads/image/noImage.jpg จาก array filePath
                            await servicesModel.updateOne(query, { $pull: { filePath: 'uploads/image/noImage.jpg' } });
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




exports.updateDataServicesController = async function (query, update) {
    return new Promise((resolve, reject) => {
        servicesModel
            .findByIdAndUpdate(query._id, update, { new: true })
            .then(updateservices => {
                // find services and delete
                if (updateservices) {
                    var resInfo = { result: { updateservices }, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no services in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};



