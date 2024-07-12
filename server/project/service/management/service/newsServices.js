var mongo = require('mongodb');
var newsController = require('../controller/newsController');
var resMsg = require('../../../../../config/message');

exports.getNewsByIdService = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await newsController.getNewsController(query);
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

exports.getsNewsServices = async function (request, response, next) {
    try {
        const doc = await newsController.getsNewsController();
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

exports.addNewsServices = async function (request, response, next) {
    try {
        var data = { filePath: [], linkVideo: [], linkImage: [], linkPage: "" };
        //add all image and file path to array
        request.files.forEach(file => {
            data.filePath.push(file.path);
        });

        // add all links from request body
        if (request.body.linkVideo) {
            data.linkVideo = request.body.linkVideo;
        }
        if (request.body.linkImage) {
            data.linkImage = request.body.linkImage;
        }
        if (request.body.linkPage) {
            data.linkPage = request.body.linkPage;
        }
        const doc = await newsController.addNewsController(data);
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

exports.deleteNewsServices = async function (request, response, next) {
    try {
        var query = {};
        query._id = new mongo.ObjectId(request.params.id);
        const doc = await newsController.deleteNewsController(query);

        // Delete the file without noImage
        if (doc.result.filePath) {
            doc.result.filePath = doc.result.filePath.filter(file => {
                if (file !== 'uploads/image/noImage.jpg') {
                    const filePath = path.join(__dirname, '../' + file);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            return response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
                        }
                    });
                    return false;
                }
                return true;
            });
        }
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
