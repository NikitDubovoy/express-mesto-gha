const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
app.use((req, res, next) => {
  req.user = {
    _id: '630b78deed6ab7dfd7a26045',
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
});
