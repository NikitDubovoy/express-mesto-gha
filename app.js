const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const errorServer = require('./errors/serverError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(cookieParser());
app.use(routes);
app.use(errors());
app.use(errorServer);

app.listen(PORT, () => {
});
