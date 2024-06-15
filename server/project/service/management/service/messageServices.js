var mongo = require('mongodb');
var messageController = require('../controller/messageController');
var resMsg = require('../../../../../config/message');

exports.getRequestService = async function (request, response, next) {
    try {
        query = {}
        if(request.role == "user"){
            query = {userId: new mongo.ObjectId(request.userId)}
            console.log(query)
        }
        const doc = await messageController.getRequestController(query);
        response.status(doc.code.codeNO).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });

    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNO).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};

exports.getMessageReplyService = async function (request, response, next) {
    try {
        var query = {}
        query._id = new mongo.ObjectId(request.params.id)

        const doc = await messageController.getMessageReplyController(query);
        response.status(doc.code.codeNO).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error);
            response.status(err.code.codeNO).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};


exports.updateMessageReplyService = async function (request, response, next) {
    try {
        const messageId = request.params.id;
        const messageReplyData = request.body;
        messageReplyData.user = request.userId;
        const now = new Date();
        messageReplyData.date = now;

        const doc = await messageController.updateMessageReplyController(messageId, messageReplyData);
        response.status(doc.code.codeNO).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error);
            response.status(err.code.codeNO).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};

exports.createRequestService = async function (request, response, next) {
    try {
        //request body from db
        var data = request.body;
        data.userId = request.userId;
        //add data
        const doc = await messageController.createRequestController(data);
        response.status(doc.code.codeNO).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });

    } catch (err) {
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNO).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};

exports.updateRequestService = async function (request, response, next) {
    try {
        const query = {};
        query._id = new mongo.ObjectId(request.params.id);

        const doc = await messageController.updateRequestController(query, request.body);
        response.status(doc.code.codeNO).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });

    } catch (err) {
        if (err.code) {
            response.status(err.code.codeNO).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};

exports.deleteRequestService = async function (request, response, next) {
    try {
        //หาไอดี user
        const query = {};
        query._id = new mongo.ObjectId(request.params.id);

        // Delete data
        const doc = await messageController.deleteRequestController(query);
        response.status(doc.code.codeNO).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });

    } catch (err) {
        if (err.code != null) {
            console.log(err.error);
            response.status(err.code.codeNO).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};