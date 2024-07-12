var counterModel = require('../models/counterModel');

exports.getStatController = async function (query) {
    return new Promise((resolve, reject) => {
        counterModel
            .findOne(query, { __v: 0, createdAt: 0, _id: 0 })
            .then(doc => {
                if (!doc) {
                    var resInfo = { result: {}, code: { codeNo: 404, description: 40401 } };
                    reject(resInfo);
                }
                var weeklyAccess = 0;
                const today = new Date();
                const stringToday = today.toISOString().slice(0, 10);
                const stringThisMonth = today.toISOString().slice(0, 7);
                const stringThisYear = today.toISOString().slice(0, 4);
                for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    const dateString = date.toISOString().slice(0, 10);
                    weeklyAccess += doc.dailyAccess.get(dateString) || 0;
                }

                data = {
                    totalAccess: doc.totalAccess,
                    dailyAccess: doc.dailyAccess.get(stringToday),
                    weeklyAccess: weeklyAccess,
                    monthlyAccess: doc.monthlyAccess.get(stringThisMonth),
                    yearlyAccess: doc.yearlyAccess.get(stringThisYear),
                    researchAccess: doc.researchAccess,
                };

                var resInfo = { result: data, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

exports.getProductController = async function (query) {
    return new Promise((resolve, reject) => {
        counterModel
            .findOne(query, { __v: 0, createdAt: 0, _id: 0 })
            .then(doc => {
                if (!doc) {
                    var resInfo = { result: {}, code: { codeNo: 404, description: 40401 } };
                    reject(resInfo);
                }
                var resInfo = { result: doc.researchAccess, code: { codeNo: 200, description: 20000 } };
                resolve(resInfo);
            }).catch(err => {
                var resInfo = { error: err, code: { codeNo: 500, description: 50003 } };
                reject(resInfo);
            });
    });
};

