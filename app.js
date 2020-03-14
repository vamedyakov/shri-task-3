const path = require('path');
const express = require('express');
const apiRoute = require('./routes/api');

const app = express();

app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', apiRoute);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000);
