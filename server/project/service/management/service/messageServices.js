var mongo = require('mongodb');
var messageController = require('../controller/messageController');

exports.onQuery = async function (request, response, next) {
    try {

        var querys = {};
        const doc = await messageController.onQuery(querys);

        var resData = await resMsg.onMessage_Response(0,20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        var resData = await resMsg.onMessage_Response(0,40400);
        response.status(404).json(resData);
    }
};
exports.onQuerys = async function (request, response, next) {
    try {

        var querys = {};

        const doc = await messageController.onQuerys(querys);

        var resData = await resMsg.onMessage_Response(0,20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        console.log(err);
        var resData = await resMsg.onMessage_Response(0,40400);
        response.status(404).json(resData);
    }
};
exports.onCreate = async function (request, response, next) {
    try {
        const doc = await messageController.onCreate(request.body);

        var resData = await resMsg.onMessage_Response(0,20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        var resData = await resMsg.onMessage_Response(0,40400);
        response.status(404).json(resData);
    }
};
exports.onUpdate = async function (request, response, next) {
    try {

        var query = {};
        query._id = new mongo.ObjectId(request.body._id);

        const doc = await messageController.onUpdate(query,request.body);


        var resData = await resMsg.onMessage_Response(0,20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        
        var resData = await resMsg.onMessage_Response(0,40400);
        response.status(404).json(resData);
    }
};
exports.onDelete = async function (request, response, next) {
    try {

        var query = {};
        query._id = new mongo.ObjectId(request.body.id);
        const doc = await messageController.onDelete(query);

        var resData = await resMsg.onMessage_Response(0,20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {

        var resData = await resMsg.onMessage_Response(0,40400);
        response.status(404).json(resData);
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