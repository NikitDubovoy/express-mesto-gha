const express = require('express');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const router = express.Router();
const {
  getCard, createdCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', express.json(), getCard);
router.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i),
  }),
}), createdCard);
router.delete('/:cardId', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
}), removeCard);
router.put('/:cardId/likes', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
}), likeCard);
router.delete('/:cardId/likes', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
}), dislikeCard);

module.exports = router;
