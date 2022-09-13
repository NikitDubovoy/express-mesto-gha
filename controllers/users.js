const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error = require('../utils/utils');

const isAvatarValidator = (avatar) => /(\b(https?|http):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig.test(avatar);

const createdUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email) && (!email)) {
    Error.invalidEmail(res);
  } else if (!isAvatarValidator(avatar)) {
    Error.invalidAvatar(res);
  } else if (!password) {
    Error.invalidPassword(res);
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
              Error.isEmail(res, 'The entered email exists');
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

const getThisUser = (req, res) => {
  const { _id } = req.user;
  User.find({ _id })
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
      .orFail(() => Error.invalidData(res))
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
            Error.invalidPassword(res);
          });
      });
  } else {
    Error.invalidEmail(res);
  }
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
