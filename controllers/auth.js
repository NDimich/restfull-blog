const bcrypt = require('bcryptjs');
const Author = require('../models/Author');
const saveAuthor = require('./authors');

module.exports.login = async function (req, res) {
  const candidate = await Author.findOne({email: req.body.email});
  if(candidate) {
    if(bcrypt.compareSync(req.body.password, candidate.password)) {
      let author = {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        isAdmin: candidate.isAdmin
      };
      res.status(200).json({author: author, success: true});
    } else {
      res.status(401).json({
        message: 'Доступ заборонено', success: false
      });
    }
  } else {
    res.status(404).json({
      message: 'Доступ заборонено', success: false
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