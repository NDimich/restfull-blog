
const Author = require('../models/Author');
const Blog = require('../models/Blog');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function(req, res) {
  const query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  try {
    const responce = [];
    let blog = {};
    const blogs = await Blog.find(query).sort({date: -1});
    for(let i=0; i<blogs.length; i++) {
      let authorInfo = await Author.findOne({_id: blogs[i].author});
      blog = {
        author: blogs[i].author,
        body: blogs[i].body,
        category: blogs[i].category,
        date: blogs[i].date,
        mainImage: blogs[i].mainImage,
        subTitle: blogs[i].subTitle,
        title: blogs[i].title,
        _id: blogs[i]._id,
        authorInfo: authorInfo ? authorInfo : {firstName: '', lastName: ''}
      };
      responce[i] = blog;
    }
    res.status(200).json(responce);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function(req, res) {
  try {
    const blog =await Blog.findById(req.params.id);
    let authorInfo = await Author.findOne({_id: blog.author});
    const responce = {
      author: blog.author,
      body: blog.body,
      category: blog.category,
      date: blog.date,
      mainImage: blog.mainImage,
      subTitle: blog.subTitle,
      title: blog.title,
      _id: blog._id,
      authorInfo: authorInfo ? authorInfo : {firstName: '', lastName: ''}
    };
    res.status(200).json(responce);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async function(req, res) {
  try {
    const blog = await new Blog({
      title: req.body.title,
      subTitle: req.body.subTitle,
      body: req.body.body,
      author: req.body.author,
      mainImage: req.file ? req.file.path : '',
      category: req.body.category
    }).save();
    res.status(201).json(blog);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async function(req, res) {
  const blog = {
    title: req.body.title,
    subTitle: req.body.subTitle,
    body: req.body.body,
    author: req.body.author,
    mainImage: req.file ? req.file.path : '',
    category: req.body.category
  };
  try {
    const  newBlog = await Blog.findOneAndUpdate(
        {_id: req.params.id},
        {$set: blog},
        {new: true}
    );
    res.status(200).json(newBlog);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.delete = async function(req, res) {
  try{
    await  Blog.findByIdAndRemove({_id: req.params.id});
    res.status(200).json({message: 'Публікацію було успішно видалено.'})
  } catch (e) {
    errorHandler(res, e);
  }
};