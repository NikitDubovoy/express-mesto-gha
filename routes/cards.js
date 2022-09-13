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
    link: Joi.string().required().uri(),
    createdAt: Joi.date().required(),
    owner: Joi.objectId().required(),
  }),
}), createdCard);
router.delete('/:cardId', express.json(), removeCard);
router.put('/:cardId/likes', express.json(), celebrate({
  body: Joi.object().keys({
    idCard: Joi.objectId().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', express.json(), celebrate({
  body: Joi.object().keys({
    idCard: Joi.objectId().required(),
  }),
}), dislikeCard);

module.exports = router;
