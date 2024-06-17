/**
 * Created by sherlock on 01/02/2017.
 */

var os = require("os");
require('dotenv').config();

module.exports = {
    debug: true,
    key:process.env.KEY,
    // mongoURI: 'mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+'/'+process.env.MONGO_NAME+'?authSource=admin',
    mongoURI: 'mongodb://localhost:27017/MFii?authSource=admin',
    // mongoURI: 'mongodb://192.168.172.136:27017/MFii?authSource=admin',
    timeout: 500000,
    tokenLength: 32,
    tokenExpired: (86400000 * 30),
    transactionExpired: (60000 *10),
    host: {
        name: os.hostname(),
        url:process.env.BASE_SERVER_URL,
        port: process.env.PORT
    },

    images_part : {
        profile : "profile/",
        ranks : "ranks/"
    }



};
