var mongo = require('mongodb');
var messageController = require('../controller/messageController');
var messageModel = require('../models/messageModel');
var resMsg = require('../../../../../config/message');
const { ObjectId } = require('mongodb');

exports.getRequestService = async function (request, response, next) {
    try {

        // var querys = {userId : request.params._id};
        // const objectId = new ObjectId(querys.userId);
        const doc = await messageController.getRequestController();
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
        const messageId = request.params.id;

        const doc = await messageController.getMessageReplyController(messageId);
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
// exports.onQuery = async function (request, response, next) {
//     try {

//         var querys = {};
//         const doc = await messageController.onQuery(querys);

//         var resData = await resMsg.onMessage_Response(0,20000);
//         resData.data = doc;
//         response.status(200).json(resData);

//     } catch (err) {
//         var resData = await resMsg.onMessage_Response(0,40400);
//         response.status(404).json(resData);
//     }
// };

exports.createRequestService = async function (request, response, next) {
    try {
        //request body from db
        var data = request.body;
        //Change string to json
        // data.userId = JSON.parse(data.userId);
        // data.BusinessType = JSON.parse(data.BusinessType);
        // data.Description = JSON.parse(data.Description);
        // data.Scope = JSON.parse(data.Scope);

        //add data
        const doc = await messageController.createRequestController(data);
        response.status(doc.code.codeNO).json({ result: doc.data, detail: resMsg.getMsg(doc.code.description) });

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
        //หาไอดั user
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



exports.onMessage_Response = async function (number, code, res) {
    try {

        var query = {};
        (api_number != null)? query.number = number : query.number = 0;
        (code != null)? query.code = code : null;

        var doc =  await infomation_messages.onQuery(query);
        delete doc._id;
        delete doc.create;
        delete doc.update;
        delete doc.__v;
        delete doc.number;
        delete doc.enable;

        return doc;

    } catch (err) {
        return err;
    }
};