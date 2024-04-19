var mongo = require('mongodb');
const { ObjectId } = require('mongodb');
var PlantController = require('../controller/PlantController');
var PictureController = require('../../Picture/controller/PictureController');
var resMsg = require('../../../../../config/message');

exports.getDetailService = async function (request, response, next) {
    try {
        var query = { PlantId : request.params._id};
        const objectId = new ObjectId(query.PlantId);
        const doc = await PlantController.getDetailController(objectId);
        const img = await PictureController.getPlantImage(query);
        doc.result.Image = img.result.Image;
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
exports.getPlantsService = async function (request, response, next) {
    try {
        // request => {keyword: "String"}
        let keyword = request.body.keyword.trim();
        let querys;
        let regex = /^[ก-๙a-zA-Z]/;
        if (keyword.startsWith('/')) {
            keyword = keyword.slice(1);
            querys =
                [
                    { 'Name.TH': { $regex: keyword, $options: 'i' } },
                    { 'Name.EN': { $regex: keyword, $options: 'i' } },
                    { 'OtherName.TH': { $regex: keyword, $options: 'i' } },
                    { 'OtherName.EN': { $regex: keyword, $options: 'i' } },
                    { 'SciName.ScienName': { $regex: keyword, $options: 'i' } },
                    { 'SciName.AuthorName': { $regex: keyword, $options: 'i' } },
                    { 'CommonName': { $regex: keyword, $options: 'i' } }

                    // { 'Name': { $regex: keyword, $options: 'i' } },
                    // { 'SciName': { $regex: keyword, $options: 'i' } }
                ];
        } else if (regex.test(keyword)) {
            querys =
                [
                    { 'Name.TH': { $regex: `^${keyword}`, $options: 'i' } },
                    { 'Name.EN': { $regex: `^${keyword}`, $options: 'i' } },
                    { 'SciName.ScienName': { $regex: `^${keyword}`, $options: 'i' } },
                    { 'SciName.AuthorName': { $regex: `^${keyword}`, $options: 'i' } },
                    { 'CommonName': { $regex: `^${keyword}`, $options: 'i' } },
                    { 'OtherName.TH': { $regex: `^${keyword}`, $options: 'i' } },
                    { 'OtherName.EN': { $regex: `^${keyword}`, $options: 'i' } }
                //     { 'Name': { $regex: `^${keyword}`, $options: 'i' } },
                //     { 'SciName': { $regex: `^${keyword}`, $options: 'i' } }
                ];
        }
        else {
            response.status(404).json({ result: {}, detail: resMsg.getMsg(40401) });
        }

        const doc = await PlantController.getPlantsController(querys);
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
exports.addPlantService = async function (request, response, next) {
    try {
        const doc = await PlantController.addPlantController(request.body);
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
exports.onUpdate = async function (request, response, next) {
    try {

        var query = {}
        query._id = new mongo.ObjectId(request.body._id);

        const doc = await PlantController.onUpdate(query, request.body);


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
        const doc = await PlantController.onDelete(query);

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
