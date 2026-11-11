const { randomUUID } = require('node:crypto');
const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');
const { storageDirectory, maxFileSize } = require('../config/storage');

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: storageDirectory,
    filename: (_req, _file, callback) => callback(null, randomUUID()),
  }),
  limits: { fileSize: maxFileSize },
});

router.post('/upload', upload.single('file'), documentController.upload);
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = router;