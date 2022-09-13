const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error = require('../utils/utils');

const isAvatarValidator = (avatar) => /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/.test(avatar);

const createdUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    Error.invalidEmail(res);
  } else if (!isAvatarValidator(avatar)) {
    Error.invalidAvatar(res);
  } else {
    bcrypt.hash(password, 10)
      .then((hashPassword) => {
        User.create({
          name, about, avatar, email, password: hashPassword,
        })
          .then((user) => Error.isSuccess(res, user))
          .catch((e) => {
            if (e.name === 'ValidationError') {
              Error.isCastError(res, e.message);
              return;
            }
            if (e.code === 11000) {
              Error.isCastError(res, 'The entered email exists');
            }
          });
      })
      .catch((e) => {
        Error.isServerError(res, e);
      });
  }
};

const getUsers = (req, res) => {
  User.find({})
    .then((user) => Error.isSuccess(res, user))
    .catch((e) => Error.isServerError(res, e));
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        Error.isNotFound(res);
        return;
      }
      Error.isSuccess(res, user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        Error.isCastError(res, e.name);
        return;
      }
      Error.isServerError(res, e);
    });
};

const updateUser = (req, res) => {
  const { about, name } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { about, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        Error.isNotFound(res);
        return;
      }
      Error.isSuccess(res, user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        Error.isCastError(res, e.name);
        return;
      }
      if (e.name === 'CastError') {
        Error.isNotFound(res, e.name);
        return;
      }
      Error.isServerError(res, e);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        Error.isNotFound(res);
        return;
      }
      Error.isSuccess(res, user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        Error.isCastError(res);
        return;
      }
      if (e.name === 'CastError') {
        Error.isNotFound(res);
        return;
      }
      Error.isServerError(res, e);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (validator.isEmail(email)) {
    User.findOne({ email }).select('+password')
      .orFail(() => Error.isNotFound(res))
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
              res.send({ message: user });
            } else {
              Error.invalidData(res);
            }
          })
          .catch(() => {
            Error.isServerError(res);
          });
      });
  } else {
    Error.invalidData(res);
  }
};

module.exports = {
  createdUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUser,
  login,
};
