const express = require('express');
const router = express.Router();
const controller = require('../controllers/authors');
const upload = require('../middleware/upload');
const passport = require('passport');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', passport.authenticate('jwt', {session: false}), upload.single('photo'), controller.create);

router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('photo'), controller.update);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;