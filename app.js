const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const Error = require('./utils/utils');
const { login, createdUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.post('/signin', express.json(), login);
app.post('/signup', express.json(), createdUser);
app.use(cookieParser());
app.use(auth, express.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  Error.isNotFound(res);
});
app.listen(PORT, () => {
});
