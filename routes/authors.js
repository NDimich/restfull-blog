const express = require('express');
const router = express.Router();
const controller = require('../controllers/authors');
const upload = require('../middleware/upload');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', upload.single('photo'), controller.create);

router.patch('/:id', upload.single('photo'), controller.update);

router.delete('/:id', controller.delete);

module.exports = router;