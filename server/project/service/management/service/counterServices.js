var counterController = require('../controller/counterController');
var resMsg = require('../../../../../config/message');

exports.getStatServices = async function (request, response, next) {
    try {
        query = {};
        const doc = await counterController.getStatController(query);
        response.status(doc.code.codeNo).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });

    } catch (err) {
        console.log(err)
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};

exports.getProductServices = async function (request, response, next) {
    try {
        query = {};
        const doc = await counterController.getProductController(query);
        response.status(doc.code.codeNo).json({ result: doc.result, detail: resMsg.getMsg(doc.code.description) });

    } catch (err) {
        console.log(err)
        if (err.code != null) {
            console.log(err.error)
            response.status(err.code.codeNo).json({ result: err.error, detail: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, detail: resMsg.getMsg(50000) });
        }
    }
};