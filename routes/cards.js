const express = require('express');

const router = express.Router();
const {
  getCard, createdCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', express.json(), getCard);
router.post('/', express.json(), createdCard);
router.delete('/:cardId', express.json(), removeCard);
router.put('/:cardId/likes', express.json(), likeCard);
router.delete('/:cardId/likes', express.json(), dislikeCard);

module.exports = router;
