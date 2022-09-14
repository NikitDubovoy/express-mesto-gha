const router = require('express').Router();
const express = require('express');
const cookieParser = require('cookie-parser');

const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const Error = require('../utils/utils');
const { login, createdUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i),
  }),
}), createdUser);
router.use(cookieParser());
router.use(auth, express.json());
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use(errors());
router.use((req, res) => {
  Error.isNotFound(res);
});

module.exports = router;
