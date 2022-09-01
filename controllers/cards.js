const Card = require('../models/card');
const Error = require('../utils/utils');

const createdCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  Card.create({
    name, link, owner: req.user._id, likes, createdAt,
  })
    .then((card) => Error.isSuccess(res, card))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        Error.isCastError(res, e.message);
        return;
      }
      Error.isServerError(res, e);
    });
};

const getCard = (req, res) => {
  Card.find({})
    .then((cards) => Error.isSuccess(res, cards))
    .catch((e) => {
      if (e.name === 'CastError') {
        Error.isCastError(res);
        return;
      }
      Error.isServerError(res, e);
    });
};

const removeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    .then((card) => {
      if (!card) {
        Error.isNotFound(res);
        return;
      }
      card.remove();
      Error.isSuccess(res, card);
    })
    .catch((e) => {
      if (cardId !== 'ObjectId') {
        Error.isCastError(res, 'Cast to ObjectId failed');
        return;
      }
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

const likeCard = (req, res) => {
  const idCard = req.params.cardId;
  Card.findByIdAndUpdate(
    idCard,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        Error.isNotFound(res);
        return;
      }
      Error.isSuccess(res, card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        Error.isNotFound(res, e.message);
        return;
      }
      if (e.name === 'CastError') {
        Error.isCastError(res, e.message);
        return;
      }
      Error.isServerError(res, e);
    });
};

const dislikeCard = (req, res) => {
  const idCard = req.params.cardId;
  Card.findByIdAndUpdate(
    idCard,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        Error.isNotFound(res);
        return;
      }
      Error.isSuccess(res, card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        Error.isNotFound(res, e.message);
        return;
      }
      if (e.name === 'CastError') {
        Error.isCastError(res, e.message);
        return;
      }
      Error.isServerError(res, e);
    });
};

module.exports = {
  getCard,
  createdCard,
  removeCard,
  likeCard,
  dislikeCard,
};
