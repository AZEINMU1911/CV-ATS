// server/config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensures your .env variables are loaded

// Configure the Cloudinary SDK with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Recommended to ensure URLs are HTTPS
});

module.exports = cloudinary;