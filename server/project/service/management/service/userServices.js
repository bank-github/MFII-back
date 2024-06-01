var mongo = require('mongodb');
var userController = require('../controller/userController');
var resMsg = require('../../../../../config/message');

exports.createUserService = async function (request, response, next) {
    try {
        //wait controller save data to db
        const doc = await userController.createUserController(request.body);
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
exports.longinUserServices = async function (request, response, next) {
    try {
        // data on body only email & password
        // wait controller login
        const doc = await userController.loginUserController(request.body);
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
exports.getUserServices = async function (request, response, next) {
    try {
        console.log(request.userId);
        // no query because get all user
        const doc = await userController.getUserController();
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
exports.deleteUserServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        // query._id = new mongo.ObjectId(request.body.id);
        const doc = await userController.deleteUserContoller(query);
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
exports.updateUserPatchServices = async function (request, response, next) {
    try {

        var query = {};
        query._id = new mongo.ObjectId(request.body._id);

        const doc = await userController.onUpdate(query, request.body);


        var resData = await resMsg.onMessage_Response(0, 20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        v
        var resData = await resMsg.onMessage_Response(0, 40400);
        response.status(404).json(resData);
    }
};
exports.updateUserPutServices = async function (request, response, next) {
    try {

        var query = {};
        query._id = new mongo.ObjectId(request.body._id);

        const doc = await userController.onUpdate(query, request.body);


        var resData = await resMsg.onMessage_Response(0, 20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        v
        var resData = await resMsg.onMessage_Response(0, 40400);
        response.status(404).json(resData);
    }
};
exports.onQuery = async function (request, response, next) {
    try {

        var querys = {};
        const doc = await userController.onQuery(querys);

        var resData = await resMsg.onMessage_Response(0, 20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        var resData = await resMsg.onMessage_Response(0, 40400);
        response.status(404).json(resData);
    }
};
exports.onQuerys = async function (request, response, next) {
    try {

        var querys = {};

        const doc = await userController.onQuerys(querys);

        var resData = await resMsg.onMessage_Response(0, 20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        console.log(err);
        var resData = await resMsg.onMessage_Response(0, 40400);
        response.status(404).json(resData);
    }
};
exports.onCreate = async function (request, response, next) {
    try {
        const doc = await userController.onCreate(request.body);

        var resData = await resMsg.onMessage_Response(0, 20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        var resData = await resMsg.onMessage_Response(0, 40400);
        response.status(404).json(resData);
    }
};
exports.onUpdate = async function (request, response, next) {
    try {

        var query = {};
        query._id = new mongo.ObjectId(request.body._id);

        const doc = await userController.onUpdate(query, request.body);


        var resData = await resMsg.onMessage_Response(0, 20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {
        v
        var resData = await resMsg.onMessage_Response(0, 40400);
        response.status(404).json(resData);
    }
};
exports.onDelete = async function (request, response, next) {
    try {

        var query = {};
        query._id = new mongo.ObjectId(request.body.id);
        const doc = await userController.onDelete(query);

        var resData = await resMsg.onMessage_Response(0, 20000);
        resData.data = doc;
        response.status(200).json(resData);

    } catch (err) {

        var resData = await resMsg.onMessage_Response(0, 40400);
        response.status(404).json(resData);
    }

};
exports.onMessage_Response = async function (number, code, res) {
    try {

        var query = {};
        (api_number != null) ? query.number = number : query.number = 0;
        (code != null) ? query.code = code : null;

        var doc = await infomation_messages.onQuery(query);
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