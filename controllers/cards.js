const Card = require('../models/card');
const Error = require('../utils');

const createdCard = async (req, res) => {
  const {
    name, link, owner, likes, createdAt,
  } = req.body;
  try {
    if (name === '' || link === '') {
      Error.isCastError(res);
      return;
    }
    Card.create({
      name, link, owner: req.user._id, likes, createdAt,
    });
    Error.isSuccess(res, req.body);
    if ((!name || name.length >= 2 < 20) || (!link) || (owner !== req.user._id)) {
      Error.isCastError(res);
      return;
    }
  } catch (err) {
    Error.isServerError(res);
  }
};

async function getCard(req, res) {
  const card = await Card.find({});
  try {
    Error.isSuccess(res, card);
  } catch (err) {
    Error.isServerError(res);
  }
}

const removeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    Card.findById({ _id: cardId }, (err, card) => {
      if (!card) {
        Error.isNotFound(res);
        return;
      }
      card.remove();
      Error.isSuccess(res, card);
    });
  } catch (err) {
    Error.isServerError(res);
  }
};

const likeCard = async (req, res) => {
  const idCard = req.params.cardId;
  try {
    const card = await Card.findByIdAndUpdate(
      idCard,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      Error.isNotFound(res);
      return;
    }
    Error.isSuccess(res, 'OK, Add like');
  } catch (err) {
    Error.isServerError(res);
    const isNotFound = err.message.indexOf('not found');
    const isCastError = err.message.indexOf('Cast to ObjectId failed');
    if (err.message && (isNotFound || isCastError)) {
      Error.isNotFound(res);
    }
  }
};

const dislikeCard = async (req, res) => {
  const idCard = req.params.cardId;
  try {
    const card = await Card.findByIdAndUpdate(
      idCard,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      Error.isNotFound(res);
      return;
    }
    Error.isSuccess(res, 'OK, Deleted like');
  } catch (err) {
    const isNotFound = err.message.indexOf('not found');
    const isCastError = err.message.indexOf('Cast to ObjectId failed');
    if (err.message && (isNotFound || isCastError)) {
      Error.isNotFound(res);
    }
    Error.isServerError(res);
  }
};

module.exports = {
  getCard,
  createdCard,
  removeCard,
  likeCard,
  dislikeCard,
};
