const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getUsers, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', express.json(), getUsers);
router.get('/:userId', express.json(), getUserId);
router.patch('/me', express.json(), celebrate({
  body: Joi.object().keys({
    about: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateAvatar);

module.exports = router;
