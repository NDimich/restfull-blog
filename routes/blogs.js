const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogs');
const upload = require('../middleware/upload');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', upload.single('mainImage'), controller.create);

router.patch('/:id', upload.single('mainImage'), controller.update);

router.delete('/:id', controller.delete);

module.exports = router;