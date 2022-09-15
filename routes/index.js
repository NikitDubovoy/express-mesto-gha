const router = require('express').Router();
const express = require('express');

const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const IsNotFound = require('../errors/IsNotFound');
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
router.use(auth, express.json());
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => {
  next(new IsNotFound('Страница не найдена'));
});

module.exports = router;
