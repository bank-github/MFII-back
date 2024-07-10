var mongo = require('mongodb');
var researchController = require('../controller/researchController');
var resMsg = require('../../../../../config/message');
var researchDetail = require('../../../../../config/researchDetail');

exports.getResearchServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.query.researchId);
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
        var indust = request.params.indust;
        var prop = request.params.prop;
        var tech = request.params.tech;
        var descript = request.params.descript;
        var query = {
            $and: [
                indust === 'all' ? {} : { 'industryType': researchDetail.indust[indust] },
                prop === 'all' ? {} : { 'intelProp': researchDetail.prop[prop] },
                tech === 'all' ? {} : { 'techReadiness': researchDetail.tech[tech] },
                descript === 'all' ? {} : {
                    $or: [
                        { 'description': { $regex: descript, $options: 'i' } },
                        { 'keyword': { $elemMatch: { $regex: descript, $options: 'i' } } },
                        { 'inventor': { $elemMatch: { $regex: descript, $options: 'i' } } },
                        { 'nameProduct': { $regex: descript, $options: 'i' } },
                        { 'nameOnMedia': { $regex: descript, $options: 'i' } }                    ]
                }
            ].filter(condition => Object.keys(condition).length > 0)
        }
        if (query.$and.length === 0) {
            query = {};
        }
        const doc = await researchController.getsResearchController(query);
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

exports.deleteResearchServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await researchController.deleteResearchController(query._id, request.params.id);
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

exports.deleteFileResearchServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var update = { $pull: { filePath: request.body.filePath } };
        const doc = await researchController.updateFileResearchController(query, update);
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

exports.addFileResearchServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var update = { $push: { filePath: [] } };
        request.files.forEach(file => {
            update.$push.filePath.push(file.path); // Push each file's path to the update object
        });
        const doc = await researchController.updateFileResearchController(query, update);
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

exports.updateDataResearchServices = async function (request, response, next) {
    try {
        var query = { _id: new mongo.ObjectId(request.params.id) };
        var update = request.body;

        const doc = await researchController.updateDataResearchController(query, update);
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