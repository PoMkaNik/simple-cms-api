// env
require('dotenv').config()
// nodejs
const path = require('path');
// server
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
// db
const mongoose = require('mongoose');
// routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
// 
// 
const app = express();
// file uploads setup
const fileStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'images');
  },
  filename: (_, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  }
});
const fileFilter = (_, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// parsers
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
// static files
app.use('/images', express.static(path.join(__dirname, 'images')));
// cors
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
// express errors handler route
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});
// db connection
mongoose
  .connect(
    process.env.DATABASE_URL,
    {
      useUnifiedTopology: true, useNewUrlParser: true
    }
  )
  .then(() => app.listen(8080))
  .catch(err => console.log(err));
