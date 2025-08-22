const { User, CV } = require("../models")
const cloudinary = require('../config/cloudinaryConfig');

const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'raw' }, // Use 'raw' for non-image files like PDFs
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        stream.end(buffer);
    });
};

class CvController {

    static async uploadCV(req, res, next) {
        try {
            const userId = req.user.id
            const file = req.file
            if (!file) throw new Error("FILE_REQUIRED")
            const result = await streamUpload(file.buffer)
            const newCv = await CV.create({
                userId,
                originalName: file.originalname,
                fileName: result.public_id,     // The unique ID from Cloudinary
                fileUrl: result.secure_url,     // The HTTPS URL from Cloudinary
                fileSize: result.bytes,         // The file size in bytes from Cloudinary
            });

            res.status(201).json({
                message: "CV uploaded successfully.",
                cv: newCv
            });
        } catch (error) {
            next(error)
        }
    }
    static async getAllCvs(req, res, next) {
        try {
            const userId = req.user.id;

            const cvs = await CV.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json(cvs);
        } catch (error) {
            next(error);
        }
    }
    static async deleteCv(req, res, next) {
        try {
            const { cvId } = req.params;
            const userId = req.user.id;

            const cv = await CV.findOne({
                where: {
                    id: cvId,
                    userId: userId,
                },
            });

            if (!cv) {
                throw new Error("NOT_FOUND");
            }

            await cloudinary.uploader.destroy(cv.fileName, {
                resource_type: 'raw',
            });

            await cv.destroy();

            res.status(200).json({ message: "CV deleted successfully." });

        } catch (error) {
            next(error);
        }
    }

}
module.exports = { CvController }