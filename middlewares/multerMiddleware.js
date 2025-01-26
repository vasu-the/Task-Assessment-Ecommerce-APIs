const multer = require('multer');
const path = require('path');
const fs = require('fs');

const fileStorage = multer.diskStorage({
    // Specify where to store uploaded files
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/products'); // Folder for product images

        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true }); // directory if it doesn't exist

        cb(null, uploadPath);
    },
    // Specify the filename format
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Set up multer to handle multiple image uploads
const upload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1000000 // Max file size of 1MB
    },
    fileFilter: (req, file, cb) => {
        // Only allow .png and .jpg files
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Please upload a PNG or JPG image!'));
        }
        cb(null, true); // Accept the file
    }
});

module.exports = upload;
