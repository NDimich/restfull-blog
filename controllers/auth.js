const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Author = require('../models/Author');
const saveAuthor = require('./authors');
const key = require('../config/keys');

module.exports.login = async function (req, res) {
  const candidate = await Author.findOne({email: req.body.email});
  // user with such email found
  if(candidate) {
    // check if user is active
    if(candidate.isActive === true) {
      //check password
      if(bcrypt.compareSync(req.body.password, candidate.password)) {

        const token = jwt.sign({
              email: candidate.email,
              userId: candidate._id
            }, key.jwt, {expiresIn: 60*60*3});

        res.status(200).json({token: `Bearer ${token}`, isAdmin: candidate.isAdmin});

      } else {
        res.status(403).json({
          message: 'Доступ заборонено', success: false
        });
      }
    } else {
      res.status(403).json({
        message: 'Доступ заборонено', success: false
      });
    }
  } else {
    res.status(404).json({
      message: 'Користувача не знайдено', success: false
    })
  }
};

module.exports.register = async function (req, res) {
  const candidate = await Author.findOne({email: req.body.email});
  if(candidate) {
    res.status(409).json({
      message: `Користувач з email ${req.body.email} вжу існує. Спробуйте іниший.`
    });
  } else {
    saveAuthor.create(req, res);
  }

};