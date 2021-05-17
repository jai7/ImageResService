const util = require('util')
const multer = require('multer')
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(`dest is ${__basedir}`)
        cb(null, __imagedir);
    },
    filename: (req, file, cb) => {
        console.log("filename is " + file.originalname);
        cb(null, file.originalname);
    }
})

let uploadFile = multer({
    storage: storage,
    limits: {fileSize: maxSize}
}).single("image");

let uploadFileMiddleWare = util.promisify(uploadFile)

module.exports = uploadFileMiddleWare;