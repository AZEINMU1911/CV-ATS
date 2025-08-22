const multer = require("multer")
const storage = multer.memoryStorage()

//PDF ONLY FILTER
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        // If the file is a PDF, accept it.
        cb(null, true);
    } else {
        // If it's not a PDF, reject it by passing an error.
        // Our centralized errorHandler will catch this.
        const error = new Error("INVALID_FILE_TYPE");
        cb(error, false);
    }
};

//FILE LIMIT
const limits = {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes in bytes.
};

//UPLOADER
const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload