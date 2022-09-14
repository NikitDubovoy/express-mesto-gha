const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes/index');
const { errorServer } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(routes);
app.use(errorServer);

app.listen(PORT, () => {
});
