const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  about: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('authors', authorSchema);