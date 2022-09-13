const express = require('express');

const router = express.Router();
const {
  getUsers, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', express.json(), getUsers);
router.get('/:userId', express.json(), getUserId);
router.patch('/me', express.json(), updateUser);
router.patch('/me/avatar', express.json(), updateAvatar);

module.exports = router;
