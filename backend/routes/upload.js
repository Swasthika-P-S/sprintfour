const express = require('express');
const multer = require('multer');
const os = require('os');
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, TXT, JPG, PNG and WEBP files are allowed.'));
  },
});

const router = express.Router();
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
