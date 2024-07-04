// Middelware
const jwt = require('jsonwebtoken');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
var mongo = require('mongodb');
const sanitizeFilename = require('sanitize-filename');
const resMsg = require('../config/message');
const secretKey = "MFII-project-2023";

const models = {
    news: require('../server/project/service/management/models/newsModel'),
    research: require('../server/project/service/management/models/researchModel')
    //add other model
};

// Test Generate a JWT token
// const payload = {
//     userId: 'testUserId',
//     role: 'staff' // Change this to 'user', 'admin', etc., for different roles
// };
// // JWT token expires in 1 hour
// const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
// console.log('JWT Token:', token);

//verify role for frontend
exports.verify = function (request, response) {
    const token = request.headers.authorization;
    if (!token) {
        return response.status(401).json({ resutl: {}, description: resMsg.getMsg(40107) });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return response.status(401).json({ resutl: {}, description: resMsg.getMsg(40102) });
        }
        if (decoded.role == "admin") {
            return response.status(200).json({ resutl: { number: 0 }, description: resMsg.getMsg(20000) })
        }
        else if (decoded.role == "staff") {
            return response.status(200).json({ resutl: { number: 1 }, description: resMsg.getMsg(20000) })
        }
        else {
            return response.status(200).json({ resutl: { number: 2 }, description: resMsg.getMsg(20000) })
        }
    });
};

// verify user role
exports.verifyTokenAndRole = function (roles) {
    return function (request, response, next) {
        const token = request.headers.authorization;
        if (!token) {
            return response.status(401).json({ resutl: {}, description: resMsg.getMsg(40107) });
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return response.status(401).json({ resutl: {}, description: resMsg.getMsg(40102) });
            }
            if (!roles.includes(decoded.role)) {
                return response.status(401).json({ resutl: {}, description: resMsg.getMsg(40103) })
            }
            request.userId = decoded.userId;
            request.role = decoded.role;
            next();
        });
    }
};

// delete file path on local device
exports.deleteFileDynamic = async function (request, response, next) {
    try {
        const modelName = request.params.model;
        const Model = models[modelName];
        if (!Model) {
            return response.status(400).json({ result: {}, description: "Invalid model" });
        }
        const query = { _id: new mongo.ObjectId(request.params.id) };
        const document = await Model.findById(query._id);
        if (!document) {
            return response.status(404).json({ result: {}, description: resMsg.getMsg(40401) });
        }

        // Delete the file
        if (document.filePath) {
            document.filePath.forEach(file => {
                if (file !== 'uploads/image/noImage.jpg') {
                    const filePath = path.join(__dirname, '../' + file);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            return response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
                        }
                    });
                }
            });
            next(); // Proceed to the next middleware
        } else {
            next(); // If no imagePath, proceed to the next middleware
        }
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

// delete file path on local device
exports.deleteFileSome = async function (request, response, next) {
    try {
        const modelName = request.params.model;
        const Model = models[modelName];

        if (!request.body.filePath) {
            return response.status(400).json({ result: {}, description: "Invalid file" });
        }

        if (!Model) {
            return response.status(400).json({ result: {}, description: "Invalid model" });
        }
        const query = { _id: new mongo.ObjectId(request.params.id) };
        const document = await Model.findById(query._id);
        if (!document) {
            return response.status(404).json({ result: {}, description: resMsg.getMsg(40401) });
        }

        // Delete the file, excluding noImage.jpg
        var filePath = request.body.filePath;
        console.log(filePath)
        if (filePath !== 'uploads/image/noImage.jpg') {
            filePath = path.join(__dirname, '../' + filePath);
            fs.unlink(filePath, (err) => {
                if (err) {
                    return response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
                }
                next();
            });
        } else {
            next(); // If noImage.jpg, proceed to the next middleware without deleting
        }
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


// Function to determine the destination folder for each file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDirectory;
        // Check the file type
        if (file.mimetype.startsWith('image')) {
            uploadDirectory = 'uploads/image';
        } else if (file.mimetype === 'application/pdf') {
            uploadDirectory = 'uploads/pdf';
        } else {
            uploadDirectory = 'uploads/others';
        }

        // Set the upload folder as the destination
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        let originalName = sanitizeFilename(file.originalname);
        cb(null, Date.now() + '_' + originalName);
    }
});

const upload = multer({
    storage: storage
});

exports.upload = upload;