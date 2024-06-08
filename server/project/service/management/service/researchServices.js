var mongo = require('mongodb');
var researchController = require('../controller/researchController');
var resMsg = require('../../../../../config/message');

exports.getResearchServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await researchController.getResearchController(query);
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
exports.getsResearchServices = async function (request, response, next) {
    try {
        const doc = await researchController.getsResearchController();
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
exports.addResearchServices = async function (request, response, next) {
    try {
        var data = 
        { 
            filePath: [],
            industryType    : request.body.industryType,
            intelProp       : request.body.intelProp,
            techReadiness   : request.body.techReadiness,
            name            : request.body.name,
            inventor        : request.body.inventor,
            major           : request.body.major,
            description     : request.body.description,
            highlight       : JSON.parse(request.body.highlight),
            coop            : JSON.parse(request.body.coop),
            link            : request.body.link,
            status          : Number(request.body.status)
        };
        //add all image path to array
        request.files.forEach(file => {
            data.filePath.push(file.path);
        });
        const doc = await researchController.addResearchController(data);
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