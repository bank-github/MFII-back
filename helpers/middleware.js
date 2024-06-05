const jwt = require('jsonwebtoken');
const resMsg = require('../config/message')
const secretKey = "MFII-project";
const multer = require('multer');
const fs = require('fs');

exports.verifyTokenAndRole = function(role){
    return function(request, response, next) {
        const token = request.headers.authorization;
        if (!token) {
            return response.status(401).json({resutl: {}, description: resMsg.getMsg(40102)});
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return response.status(401).json({resutl: {}, description: resMsg.getMsg(40102)});
            }
            if(decoded.role != role){
                return response.status(401).json({resutl: {}, description: resMsg.getMsg(40103)})
            }
            request.userId = decoded.userId;
            next();
        });
    }
}

// Function to determine the destination folder for each file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDirectory;
        console.log(file);
        // Check the file type
        if (file.mimetype.startsWith('image')) {
            uploadDirectory = 'uploads/image';
        } else if (file.mimetype === 'application/pdf') {
            uploadDirectory = 'uploads/pdf';
        } else {
            uploadDirectory = 'uploads/others';
        }

        // Construct the directory path

        // Create the folder if it doesn't exist
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        // Set the upload folder as the destination
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

exports.upload = multer({ storage: storage });
