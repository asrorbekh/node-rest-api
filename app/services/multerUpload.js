const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const randomString = generateRandomString(6);
        cb(null, `${Date.now()}-${randomString}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
