var IPModel = require('../models/ipModel');
var researchModel = require('../models/researchModel');

exports.getIPController = async function (query) {
    return new Promise((resolve, reject) => {
        IPModel
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

exports.getsIPController = async function (query) {
    return new Promise((resolve, reject) => {
        IPModel
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

exports.addIpController = async function (data) {
    return new Promise((resolve, reject) => {
        var IPModels = new IPModel(data);
        IPModels.save()
            .then(() => {
                var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.deleteIPController = async function (query) {
    return new Promise((resolve, reject) => {
        IPModel
            .findOneAndDelete(query)
            .then(deleteIP => {
                // find ip and delete
                if (deleteIP) {
                    var resInfo = { result: {}, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no ip in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};

exports.updateDataIPController = async function (query, update) {
    return new Promise((resolve, reject) => {
        IPModel
            .findByIdAndUpdate(query._id, update, { new: true })
            .then(updateIP => {
                // find ip and update
                if (updateIP) {
                    var resInfo = { result: { updateIP }, code: { codeNo: 200, description: 20000 } }
                    resolve(resInfo);
                }
                //no ip in database
                else {
                    reject({ error: {}, code: { codeNo: 404, description: 40402 } });
                }
            }).catch(err => {
                reject({ error: err, code: { codeNo: 500, description: 50000 } });
            });
    });
};

exports.countIPController = async function (query) {
    return new Promise((resolve, reject) => {
        IPModel
        .aggregate([
            { $match: query }, // กรองข้อมูลตาม query ที่ส่งมา
            {
                $group: {
                    _id: { beLongTo: "$beLongTo", ipType: "$ipType" },
                    count: { $sum: 1 } // นับจำนวนเอกสารในแต่ละกลุ่ม
                }
            },
            {
                $group: {
                    _id: "$_id.beLongTo",
                    ipTypeCounts: {
                        $push: {
                            ipType: "$_id.ipType",
                            count: "$count"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    beLongTo: "$_id",
                    ipTypeCounts: 1
                }
            }
        ]).then(doc => {
            var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } };
            resolve(resInfo);
        }).catch(err => {
            var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
            reject(resInfo);
        });
    });
};

exports.firstPageIPController = async function (query) {
    return new Promise((resolve, reject) => {
        IPModel
        .aggregate([
            { $match: query }, // กรองข้อมูลตาม query ที่ส่งมา
            {
                $project: {
                    ipType: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$ipType", "สิทธิบัตรการประดิษฐ์"] }, then: "สิทธิบัตรการประดิษฐ์" },
                                { case: { $eq: ["$ipType", "อนุสิทธิบัตร"] }, then: "อนุสิทธิบัตร" },
                                { case: { $eq: ["$ipType", "สิทธิบัตรการออกแบบผลิตภัณฑ์"] }, then: "สิทธิบัตรการออกแบบผลิตภัณฑ์" },
                                { case: { $eq: ["$ipType", "เครื่องหมายการค้า"] }, then: "เครื่องหมายการค้า" }
                            ],
                            default: "ลิขสิทธิ์" // ถ้านอกเงื่อนไข
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$ipType",
                    count: { $sum: 1 } // นับจำนวนเอกสารของแต่ละ ipType
                }
            },
            {
                $project: {
                    _id: 0,
                    ipType: "$_id",
                    count: 1
                }
            }
        ]).then(doc => {
            var resInfo = { result: doc, code: { codeNo: 200, description: 20000 } };
            resolve(resInfo);
        }).catch(err => {
            var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
            reject(resInfo);
        });
    });
};
