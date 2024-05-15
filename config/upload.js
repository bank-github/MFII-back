const multer = require('multer');

// set upload directory and rename upload file with timestamp
const option = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'upload/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() +'_'+ file.originalname); // file name => date_filename
    }
});

const upload = multer({
    storage: option,
    // fileFilter:function(req, file, callback){
    //     if(
    //         file.mimetype == "image/png" ||
    //         file.mimetype == "image/jpg"
    //     ){
    //         callback(null,ture);
    //     }else{
    //         callback(null,false);
    //     }
    // },
    limitt: {
        fileSize: 1048576 // 1 Mb
    }
});

module.exports = upload;