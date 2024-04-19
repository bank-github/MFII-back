var mongo = require('mongodb');
var UserController = require('../controller/UserController');
var resMsg = require('../../../../../config/message');

exports.loginService = async function (request, response, next) {
    try {
        // data = {username: ... , password: ...}
        var { username, password } = request.body;
        var querys = { query: { UserName: username }, Password: password };
        const doc = await UserController.loginController(querys);
        // result: true/false
        response.status(doc.code.codeNO).json({ result: doc.status, detail: resMsg.getMsg(doc.code.description) });

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
exports.onQuerys = async function (request, response, next) {
    try {

        var querys = {};

        const doc = await UserController.onQuerys(querys);

        var resData = await resMsg.onMessage_Response(0, 20000)
        resData.data = doc
        response.status(200).json(resData);

    } catch (err) {
        console.log(err)
        var resData = await resMsg.onMessage_Response(0, 40400)
        response.status(404).json(resData);
    }
};
exports.createAdminService = async function (request, response, next) {
    try {
        // data = {username: ... , password: ...}
        var { username, password } = request.body;
        var data = { UserName: username, Password: password };
        const doc = await UserController.createAdminService(data);
        // result: true/false
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
exports.onUpdate = async function (request, response, next) {
    try {

        var query = {}
        query._id = new mongo.ObjectId(request.body._id);

        const doc = await UserController.onUpdate(query, request.body);


        var resData = await resMsg.onMessage_Response(0, 20000)
        resData.data = doc
        response.status(200).json(resData);

    } catch (err) {
        v
        var resData = await resMsg.onMessage_Response(0, 40400)
        response.status(404).json(resData);
    }
};
exports.onDelete = async function (request, response, next) {
    try {

        var query = {};
        query._id = new mongo.ObjectId(request.body.id)
        const doc = await UserController.onDelete(query);

        var resData = await resMsg.onMessage_Response(0, 20000)
        resData.data = doc
        response.status(200).json(resData);

    } catch (err) {

        var resData = await resMsg.onMessage_Response(0, 40400)
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

        return doc

    } catch (err) {
        return err
    }
};