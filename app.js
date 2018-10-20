const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI, {useNewUrlParser: true}).then(() => console.log('MongoDB conected')).catch(err => console.log(err));

const app=express();

const blogsRoute = require('./routes/blogs');
const authorsRoute = require('./routes/authors');
const categoriesRoute = require('./routes/categories');
const uploadsRoute = require('./routes/uploads');
const authRoute = require('./routes/auth');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'), uploadsRoute);
app.use('/api/blogs', blogsRoute);
app.use('/api/auth', authRoute);
app.use('/api/authors', authorsRoute);
app.use('/api/categories', categoriesRoute);



module.exports = app;