const User = require('../models/user');

const createdUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar });
  try {
    res.status(200).send(req.body);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const getUsers = async (req, res) => {
  const user = await User.find({});
  try {
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const getUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    User.findById({ _id: userId }, (err, user) => {
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      if (userId === 'ObjectId') {
        res.status(400).send({ message: err.message }, 'No valid ID');
        return;
      }
      res.status(200).send(user);
    });
  } catch (e) {
    res.status(500).send({ message: e.message }, 'Server error');
  }
};

const updateUser = async (req, res) => {
  const { about, name } = req.body;
  const { _id } = req.user;
  try {
    if (about === '' || name === '') {
      res.status(400).send('No valid data');
      return;
    }
    const user = await User.findByIdAndUpdate(_id, { about, name });
    if (!user) {
      req.status(404).send('User not found');
      return;
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(_id, { avatar });
    if (!user) {
      req.status(404).send('User not found');
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  createdUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUser,
};
