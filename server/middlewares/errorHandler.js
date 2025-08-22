const multer = require('multer');
const errorHandler = (err, req, res, next) => {
    let code = 500
    let message = "Internal Server Error"
    // console.log(err)
    // Login / Register Error
    if (err.message === "INVALID_CREDENTIALS") {
        code = 401
        message = "Incorrect Email/Password"
    } else if (err.message === "NO_INPUT") {
        code = 401
        message = "Check Input"
    } else if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        code = 400
        message = err.errors[0].message;
    }//Authenication Error 
    else if (err.message === "TOKEN_REQUIRED" || err.message === "USER_NOT_FOUND") {
        code = 401;
        message = "Authentication failed. Please log in.";
    } else if (err.name === 'JsonWebTokenError') {
        code = 401;
        message = "Invalid token.";
    } //Multer Error (Upload)
    else if (err.message === "INVALID_FILE_TYPE") {
        code = 400;
        message = "Invalid file type. Only PDF files are allowed.";
    } else if (err instanceof multer.MulterError) {
        code = 400;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = "File is too large. Maximum size is 5MB.";
        } else {
            message = err.message;
        }
    }//No File upload error 
    else if (err.message === "FILE_REQUIRED") {
        code = 400;
        message = "No file was uploaded. Please select a file to upload.";
    } else if (err.message === "NOT_FOUND") {
        code = 404
        message = "CV not found"
    }

    res.status(code).json({ message })
}

module.exports = { errorHandler }