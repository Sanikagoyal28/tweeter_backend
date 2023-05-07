const multer = require('multer')
// creates an upload folder and upload all the files in it but those final name is not readable so we create disk storage
// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./upload")
    },
    filename: (req, file, cb) => {
        console.log(file)
        console.log(req.files)
        req.file = file;
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const validateFiles = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "video/mp4")
        cb(null, true)
    else
        cb(null, false)
}

const multerUpload = multer({
    storage: storage,
    fileFilter: validateFiles
})

module.exports = multerUpload