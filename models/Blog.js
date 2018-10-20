const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    required: true
  },
  mainImage: {
    type: String,
    default: '',
  },
  author: {
    ref: 'authors',
    type: Schema.Types.ObjectId
  },
  category: {
    ref: 'categories',
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('blogs', blogSchema);