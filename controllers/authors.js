const bcrypt = require('bcryptjs');
const Author = require('../models/Author');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function(req, res) {
  const query = {};
  if(req.query.email) {
    query.email = req.query.email
  }
  try {
    const authors = await Author.find(query).sort({lastName: -1});
    res.status(200).json(authors);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function(req, res) {
  try {
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function(req, res) {
  const salt = bcrypt.genSaltSync(10);
  const password = req.body.password;
  const author = new Author({
    firstName: req.body.firstName.toLowerCase(),
    lastName: req.body.lastName.toLowerCase(),
    email: req.body.email,
    password: bcrypt.hashSync(password, salt),
    photo: req.file ? req.file.path : ''
  });
  try {
    await author.save();
    res.status(201).json(author);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.delete = async function(req, res) {
  try {
    await Author.findByIdAndRemove({_id: req.params.id});
    res.status(200).json({message: 'Автора було успішно видалено.'});
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function(req, res) {
  const author = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    photo: req.file ? req.file.path : ''
  };
  try{
    const newAuthor = await Author.findOneAndUpdate(
        {_id: req.params.id},
        {$set: author},
        {new: true}
    );
    res.status(200).json(newAuthor);
  } catch (e) {
    errorHandler(res, e);
  }
};
