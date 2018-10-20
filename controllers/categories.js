const Category = require('../models/Category');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function(req, res) {
  try {
    const categories = await Category.find().sort({name: 1});
    res.status(200).json(categories);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function(req, res) {
  try {
    const category = await new Category({
      name: req.body.name
    }).save();
    res.status(200).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.delete = async function(req, res) {
  try {
    await Category.findOneAndRemove({_id: req.params.id});
    res.status(200).json({message: 'Тему було успішно видалено'});
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function(req, res) {
  const cat = {
    name: req.body.name
  };
  try {
    const newCat = await Category.findOneAndUpdate(
        {_id: req.params.id},
        {$set: cat},
        {new: true}
    );
    res.status(200).json(newCat);
  } catch (e) {
    errorHandler(res, e);
  }
};

