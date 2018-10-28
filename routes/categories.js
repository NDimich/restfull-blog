const express = require('express');
const router = express.Router();
const controller = require('../controllers/categories');
const passport = require('passport');

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', passport.authenticate('jwt', {session: false}), controller.create);

router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.delete);

module.exports = router;