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

const models = {
    news: require('../server/project/service/management/models/newsModel'),
    research: require('../server/project/service/management/models/researchModel'),
    counter: require('../server/project/service/management/models/counterModel'),
    regulation: require('../server/project/service/management/models/regulationModel'),
    services: require('../server/project/service/management/models/servicesModel')
    //add other model
};

const app = express();

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
        } else if (decoded.role == "staff") {
            return response.status(200).json({ resutl: { number: 1 }, description: resMsg.getMsg(20000) })
        } else {
            return response.status(200).json({ resutl: { number: 2 }, description: resMsg.getMsg(20000) })
        }
    });
};

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
            let errors = [];
            document.filePath.forEach(file => {
                if (file !== 'uploads/image/noImage.jpg') {
                    const filePath = path.join(__dirname, '../' + file);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            errors.push(err);
                        }
                    });
                }
            });
            if (errors.length > 0) {
                console.log(errors);
                return response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
            } else {
                next();
            }
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
            let errors = [];
            request.body.filePath.forEach(file => {
                if (file !== 'uploads/image/noImage.jpg') {
                    const filePath = path.join(__dirname, '../' + file);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            errors.push(err);
                        }
                    });
                }
            });
            if (errors.length > 0) {
                console.log(errors);
                return response.status(500).json({ result: {}, description: resMsg.getMsg(50000) });
            } else {
                next();
            }
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
        let originalName = sanitizeFilename(file.originalname);
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
            case 'researchAccess':
                colName = "รายชื่องานวิจัย";
                processedData = await handleResearchAccess(query, counterData);
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

async function handleResearchAccess(query, counterData) {
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