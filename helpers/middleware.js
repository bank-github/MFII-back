<<<<<<< HEAD
// Middelware
const jwt = require('jsonwebtoken');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
var mongo = require('mongodb');
const sanitizeFilename = require('sanitize-filename');
const resMsg = require('../config/message');
const secretKey = "MFII-project-2023";
=======
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');
const sanitizeFilename = require('sanitize-filename');
const { Parser } = require('json2csv');
const resMsg = require('../config/message');
const { CreateSessionOutputFilterSensitiveLog } = require('@aws-sdk/client-s3');
const secretKey = "MFII-project-2024";
>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f

const models = {
    news: require('../server/project/service/management/models/newsModel'),
    research: require('../server/project/service/management/models/researchModel'),
    counter: require('../server/project/service/management/models/counterModel')
    //add other model
};

<<<<<<< HEAD
// Test Generate a JWT token
// const payload = {
//     userId: 'testUserId',
//     role: 'staff' // Change this to 'user', 'admin', etc., for different roles
// };
// // JWT token expires in 1 hour
// const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
// console.log('JWT Token:', token);

//verify role for frontend
=======
const app = express();

>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f
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
<<<<<<< HEAD
        }
        else if (decoded.role == "staff") {
            return response.status(200).json({ resutl: { number: 1 }, description: resMsg.getMsg(20000) })
        }
        else {
=======
        } else if (decoded.role == "staff") {
            return response.status(200).json({ resutl: { number: 1 }, description: resMsg.getMsg(20000) })
        } else {
>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f
            return response.status(200).json({ resutl: { number: 2 }, description: resMsg.getMsg(20000) })
        }
    });
};

<<<<<<< HEAD
// verify user role
=======
>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f
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

<<<<<<< HEAD
// delete file path on local device
=======
>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f
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
            next(); 
        } else {
            next();
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

exports.deleteFileSome = async function (request, response, next) {
    try {
        const Model = models[request.params.model];
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

        if (document.filePath) {
            const filePath = request.body.filePath;
            fs.unlink(filePath, (err) => {
                if (err) {
                    return response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
                }
                next();
            });
        } else {
            response.status(404).json({ result: {}, description: "File path not found" });
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

<<<<<<< HEAD
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
        const filePath = request.body.filePath;
        if (filePath !== 'uploads/image/noImage.jpg') {
            const filePath = path.join(__dirname, '../' + filePath);
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
=======
>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDirectory;
        if (file.mimetype.startsWith('image')) {
            uploadDirectory = 'uploads/image';
        } else if (file.mimetype === 'application/pdf') {
            uploadDirectory = 'uploads/pdf';
        } else {
            // Invalid file type
            return cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
        }
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
<<<<<<< HEAD
        let originalName = sanitizeFilename(file.originalname);
=======
        let originalName = sanitizeFilename(file.originalname); 
>>>>>>> 0dbc5a38e9de10cb94938d2ce9e010601cc1400f
        cb(null, Date.now() + '_' + originalName);
    }
});

const upload = multer({
    storage: storage
});

exports.upload = upload;

exports.downloadCsv = async function (request, response) {
    try {
        const modelName = 'counter';
        const Model = models[modelName];
        const query = request.query.fields;

        if (!Model) {
            return response.status(400).json({ result: {}, description: "Invalid model" });
        }

        const counterData = await Model.find().lean().exec();
        if (counterData.length === 0) {
            return response.status(404).json({ result: {}, description: "No data found" });
        }

        let colName;
        let processedData = [];

        switch (query) {
            case 'productAccess':
                colName = "รายชื่องานวิจัย";
                processedData = await handleProductAccess(query, counterData);
                break;
            case 'yearlyAccess':
                colName = "ยอดเข้าชมประจำปี";
                processedData = processAccessData(counterData, query, colName);
                break;
            case 'monthlyAccess':
                colName = "ยอดเข้าชมประจำเดือน";
                processedData = processAccessData(counterData, query, colName);
                break;
            case 'dailyAccess':
                colName = "ยอดเข้าชมประจำวัน";
                processedData = processAccessData(counterData, query, colName);
                break;
            default:
                return response.status(400).json({ result: {}, description: "Invalid query parameter" });
        }

        const fields = [colName, 'ยอดการเข้าชม'];
        const opts = { fields, quote: '"', delimiter: ',' };
        const parser = new Parser(opts);
        const csv = parser.parse(processedData);

        const csvWithBom = '\uFEFF' + csv;
        const filePath = path.join(__dirname, 'data.csv');
        fs.writeFileSync(filePath, csvWithBom);

        response.download(filePath, `${query}.csv`, (err) => {
            if (err) {
                console.error(err);
            }
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({ result: {}, description: "Internal Server Error" });
    }
};

async function handleProductAccess(query, counterData) {
    const ResearchModel = models['research'];
    if (!ResearchModel) {
        throw new Error("Invalid research model");
    }

    const researchData = await ResearchModel.find().lean().exec();
    if (researchData.length === 0) {
        throw new Error("No research data found");
    }

    const researchMap = new Map();
    researchData.forEach(research => {
        researchMap.set(String(research._id), research.nameOnMedia);
    });

    const processedData = [];
    researchMap.forEach((nameOnMedia, researchId) => {
        const entry = { 'รายชื่องานวิจัย': nameOnMedia, 'ยอดการเข้าชม': 0 };
        counterData.forEach(row => {
            const Access = row[query];
            if (Access && Access[researchId]) {
                entry['ยอดการเข้าชม'] = Access[researchId];
            }
        });
        processedData.push(entry);
    });

    processedData.sort((a, b) => b['ยอดการเข้าชม'] - a['ยอดการเข้าชม']);
    return processedData;
}

function processAccessData(counterData, query, colName) {
    const processedData = [];
    counterData.forEach(row => {
        const Access = row[query];
        if (typeof Access === 'object') {
            for (const [date, value] of Object.entries(Access)) {
                processedData.push({ [colName]: date, 'ยอดการเข้าชม': value });
            }
        }
    });
    return processedData;
}