const bcrypt = require('bcryptjs');
// const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IsNotFound = require('../errors/IsNotFound');
const IsCastError = require('../errors/IsCastError');
const IsServerError = require('../errors/IsServerError');
const IsEmail = require('../errors/IsEmail');
const InvalidData = require('../errors/InvalidData');

// eslint-disable-next-line max-len
// const isAvatarValidator = (avatar) => /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i.test(avatar);

const createdUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashPassword) => {
      User.create({
        name, about, avatar, email, password: hashPassword,
      })
        .then((user) => res.status(200).send(user))
        .catch((e) => {
          if (e.name === 'ValidationError') {
            next(new IsCastError('Неверные данные'));
          } else if (e.code === 11000) {
            next(new IsEmail('Пользователь с таким Email сущствует'));
          } else {
            next(e);
          }
        });
    })
    .catch(() => {
      next(new IsServerError('Ошибка сервера'));
    });
};

function getUsers(req, res, next) {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => next(new IsServerError('Ошибка сервера')));
}

function getThisUser(req, res, next) {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => res.status(200).send(user))
    .catch(() => next(new IsServerError('Ошибка сервера')));
}

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        next(new IsNotFound('Пользователь не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new IsCastError('Неверные данные'));
        return;
      }
      next(new IsServerError('Ошибка сервера'));
    });
};

const updateUser = (req, res, next) => {
  const { about, name } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { about, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new IsNotFound('Пользователь не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new IsCastError('Неверные данные'));
        return;
      }
      if (e.name === 'CastError') {
        next(new IsNotFound('Пользователь не найден'));
        return;
      }
      next(new IsServerError('Ошибка сервера'));
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new IsNotFound('Пользователь не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new IsCastError('Неверные данные'));
        return;
      }
      if (e.name === 'CastError') {
        next(new IsNotFound('Пользователь не найден'));
        return;
      }
      next(new IsServerError('Ошибка сервера'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => next(new InvalidData('Неверные данные')))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({
              _id: user._id,
            }, 'some-secret-key');
            res.cookie('jwt', token, {
              maxAge: 604800,
              httpOnly: true,
              sameSite: true,
            });
            res.status(200).send(user);
          } else {
            next(new InvalidData('Неверные данные'));
          }
        })
        .catch(next);
    });
};

module.exports = {
  createdUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUser,
  login,
  getThisUser,
};
