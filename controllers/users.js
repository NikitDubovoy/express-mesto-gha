const User = require('../models/user');
const Error = require('../utils/utils');

const createdUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => Error.isSuccess(res, user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        Error.isCastError(res, e.message);
        return;
      }
      Error.isServerError(res, e);
    });
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
        Error.isNotFound(res);
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

module.exports = {
  createdUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUser,
};
