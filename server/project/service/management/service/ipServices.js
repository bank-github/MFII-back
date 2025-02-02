var mongo = require('mongodb');
var IPController = require('../controller/ipController')
var resMsg = require('../../../../../config/message');

exports.getIPServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.query.ipId);
        const doc = await IPController.getIPController(query);
        response.status(doc.code.codeNo).json({ result: doc.result, description: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};

exports.getsIPServices = async function (request, response, next) {
    try {
        var ipType = request.params.ipType;
        var industType = request.params.industType;
        var descript = request.params.descript;
        var query = {
            $and: [
                ipType === 'all' ? {} : { 'ipType': ipType },
                industType === 'all' ? {} : { 'industType': industType },
                descript === 'all' ? {} : {
                    $or: [
                        { 'nameOnMedia': { $regex: descript, $options: 'i' } }, 
                        { 'inventor': { $elemMatch: { $regex: descript, $options: 'i' } } },
                        { 'beLongTo': { $regex: descript, $options: 'i' } },
                        { 'ipType': { $regex: descript, $options: 'i' } },
                        { 'industType ': { $regex: descript, $options: 'i' } },]
                }
            ].filter(condition => Object.keys(condition).length > 0)
        }
        if (query.$and.length === 0) {
            query = {};
        }
        const doc = await IPController.getsIPController(query);
        response.status(doc.code.codeNo).json({ result: doc.result, description: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};

exports.addIPServices = async function (request, response, next) {
    try {
        var data = request.body;
        const doc = await IPController.addIpController(data);
        response.status(doc.code.codeNo).json({ result: doc.result, description: resMsg.getMsg(doc.code.description) });

    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};

exports.deleteIPServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await IPController.deleteIPController(query._id);
        response.status(doc.code.codeNo).json({ result: doc.result, description: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};

exports.updateDataIPServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var update = request.body;

        const doc = await IPController.updateDataIPController(query, update);
        response.status(doc.code.codeNo).json({ result: doc.result, description: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};

exports.countIPServices = async function (request, response, next) {
    try {
        var query = {};
        const doc = await IPController.countIPController(query);
        response.status(doc.code.codeNo).json({ result: doc.result, description: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};

exports.firstPageIPServices = async function (request, response, next) {
    try {
        var query = {};
        const doc = await IPController.firstPageIPController(query);
        response.status(doc.code.codeNo).json({ result: doc.result, description: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};