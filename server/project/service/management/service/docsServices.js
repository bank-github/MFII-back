var mongo = require('mongodb');
var docsController = require('../controller/docsController');
var resMsg = require('../../../../../config/message');

exports.getDocsByIdService = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await docsController.getDocsController(query);
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

exports.getsDocsServices = async function (request, response, next) {
    try {
        const doc = await docsController.getsDocsController();
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

exports.addDocsServices = async function (request, response, next) {
    try {
        var data = request.body;
        const doc = await docsController.addDocsController(data);
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

exports.deleteDocsServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await docsController.deleteDocsController(query);

        response.status(doc.code.codeNo).json({ resutl: doc.result, description: resMsg.getMsg(doc.code.description) });
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

exports.updateDocsServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var update = request.body;

        const doc = await docsController.updateDocsController(query, update);
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