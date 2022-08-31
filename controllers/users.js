const User = require('../models/user');
const Error = require('../utils');

const createdUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    if ((name || name.length >= 2 < 20) || (about || about.length >= 2 < 20) || (avatar)) {
      User.create({ name, about, avatar });
      Error.isSuccess(res, 'Create user');
    } else {
      Error.isCastError(res);
      return;
    }
  } catch (e) {
    Error.isServerError(res);
  }
};

const getUsers = async (req, res) => {
  const user = await User.find({});
  try {
    Error.isSuccess(res, user);
  } catch (e) {
    Error.isServerError(res);
  }
};

const getUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    User.findById({ _id: userId }, (err, user) => {
      if (err) {
        const isNotFound = err.message.indexOf('not found');
        const isCastError = err.message.indexOf('Cast to ObjectId failed');
        if (err.message && (isNotFound || isCastError)) {
          Error.isCastError(res);
        }
      }
      if (!user) {
        Error.isNotFound(res);
        return;
      }
      Error.isSuccess(res, user);
    });
  } catch (e) {
    Error.isServerError(res);
  }
};

const updateUser = async (req, res) => {
  const { about, name } = req.body;
  const { _id } = req.user;
  try {
    if (!(name.length >= 2 < 20) || !(about.length >= 2 < 20)) {
      Error.isCastError(res);
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const user = await User.findByIdAndUpdate(_id, { about, name });
    Error.isSuccess(res, 'Update info user');
  } catch (e) {
    Error.isServerError(res);
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(_id, { avatar });
    if (!user) {
      Error.isNotFound(res);
    }
    Error.isSuccess(res, user);
  } catch (e) {
    Error.isServerError(res);
  }
};

module.exports = {
  createdUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUser,
};
