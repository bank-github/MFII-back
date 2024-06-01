const jwt = require('jsonwebtoken');
const resMsg = require('../config/message')
const secretKey = "MFII-project";

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