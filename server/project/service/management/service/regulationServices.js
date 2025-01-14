var mongo = require('mongodb');
var regulationController = require('../controller/regulationController');
var resMsg = require('../../../../../config/message');

exports.getRegulationServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.query.regulationId);
        const doc = await regulationController.getRegulationController(query);
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

exports.getsRegulationServices = async function (request, response, next) {
    try {
        var query = {};
        const doc = await regulationController.getRegulationController(query);
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

exports.addRegulationServices = async function (request, response, next) {
    try {
        var data = request.body;
        data.filePath = []
        console.log(request.files);
        if (request.files.length == 0) {
            data.filePath.push('uploads/image/noImage.jpg');
        }
        else {
            //add all image path to array
            request.files.forEach(file => {
                data.filePath.push(file.path);
            });
        }
        const doc = await regulationController.addRegulationController(data);
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

exports.deleteRegulationServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await regulationController.deleteRegulationController(query._id, request.params.id);
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

exports.deleteFileRegulationServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var filePathsToRemove = request.body.filePath;

        // ตรวจสอบให้แน่ใจว่า filePathsToRemove เป็น array
        if (!Array.isArray(filePathsToRemove)) {
            filePathsToRemove = [filePathsToRemove];
        }

        // วนลูปผ่านแต่ละ file path ที่จะลบ
        for (let filePath of filePathsToRemove) {
            var update = { $pull: { filePath: filePath } };
            await regulationController.updateFileRegulationController(query, update);
        }

        response.status(200).json({ result: "Files removed successfully", description: resMsg.getMsg(20000) });
    } catch (err) {
        if (err.code != null) {
            console.log(err.error);
            response.status(err.code.codeNo).json({ result: err.error, description: resMsg.getMsg(err.code.description) });
        } else {
            console.log(err);
            response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
        }
    }
};


exports.addFileRegulationServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var update = { $push: { filePath: [] } };
        request.files.forEach(file => {
            update.$push.filePath.push(file.path); // Push each file's path to the update object
        });
        const doc = await regulationController.updateFileRegulationController(query, update);
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

exports.updateDataRegulationServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var update = request.body;

        const doc = await regulationController.updateDataRegulationController(query, update);
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