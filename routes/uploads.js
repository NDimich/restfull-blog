const express = require('express');
const router = express.Router();
const controller = require('../controllers/uploads');
const upload = require('../middleware/upload');

router.post('/', upload.single('file'), controller.upload);

module.exports = router;