const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogs');
const passport = require('passport');
const upload = require('../middleware/upload');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', passport.authenticate('jwt', {session: false}),upload.single('mainImage'), controller.create);

router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('mainImage'), controller.update);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;