const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');
const sanitizeFilename = require('sanitize-filename');
const { Parser } = require('json2csv');
const resMsg = require('../config/message');
const secretKey = "MFII-project-2024";

const models = {
    news: require('../server/project/service/management/models/newsModel'),
    research: require('../server/project/service/management/models/researchModel'),
    counter: require('../server/project/service/management/models/counterModel')
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
        const Model = models['counter'];

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
        const modelName = 'counter';  // model counter
        const Model = models[modelName];
        
        if (!Model) {
            return response.status(400).json({ result: {}, description: "Invalid model" });
        }

        const query = request.query.fields;
        const counterData = await Model.find().lean().exec();
        if (counterData.length === 0) {
            return response.status(404).json({ result: {}, description: "No data found" });
        }

        let researchMap = new Map();

        if (query === 'productAccess') {
            const ResearchModel = models['research'];  // model research
            if (!ResearchModel) {
                return response.status(400).json({ result: {}, description: "Invalid research model" });
            }

            const researchData = await ResearchModel.find().lean().exec();
            if (researchData.length === 0) {
                return response.status(404).json({ result: {}, description: "No research data found" });
            }

            // สร้างแผนที่ของ _id และ nameOnMedia จาก research
            researchData.forEach(research => {
                researchMap.set(String(research._id), research.nameOnMedia);
            });
        }

        // ประมวลผลข้อมูลเพื่อให้ตรงกับรูปแบบที่ต้องการ
        const processedData = [];
        counterData.forEach(row => {
            const Access = row[query];  // ใช้ query แทน dailyAccess
            if (typeof Access === 'object') {
                for (const [date, value] of Object.entries(Access)) {
                    const entry = {};
                    if (query === 'productAccess' && researchMap.has(date)) {
                        entry[query] = researchMap.get(date);  // ใช้ nameOnMedia แทน date
                    } else {
                        entry[query] = date;  // ถ้าไม่เหมือนก็ใช้ date ตามเดิม
                    }
                    entry['view'] = value;
                    processedData.push(entry);
                }
            }
        });

        const fields = [query, 'view'];
        const opts = { fields, quote: '"', delimiter: ',' };
        const parser = new Parser(opts);
        const csv = parser.parse(processedData);

        const csvWithBom = '\uFEFF' + csv;

        const filePath = path.join('uploads/others', 'data.csv');
        fs.writeFileSync(filePath, csvWithBom);

        response.download(filePath, query+'.csv', (err) => {
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






