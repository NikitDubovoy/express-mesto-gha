const Card = require('../models/card');
const {
  IsNotFound,
  IsCastError,
  IsServerError,
  InvalidRemove,
} = require('../utils/utils');

// const isLinkCard = (link) => /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i.test(link);

const createdCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new IsCastError('Неверные данные'));
        return;
      }
      next(new IsServerError('Ошибка сервера'));
    });
};

const getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new IsCastError(res));
        return;
      }
      next(new IsServerError('Ошибка сервера'));
    });
};

const removeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    .orFail(() => new IsNotFound('Карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new InvalidRemove('Карточка не была создана текущим пользователем'));
      }
      if (card) {
        card.remove()
          .then((dataCard) => {
            res.status(200).send(dataCard);
          })
          .catch(() => {
            next(new IsServerError('Ошибка сервера'));
          });
      }
    })
    .catch(() => {
      next(new IsServerError('Ошибка сервера'));
    });
};

const likeCard = (req, res, next) => {
  const idCard = req.params.cardId;
  Card.findByIdAndUpdate(
    idCard,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new IsNotFound('Карточка не найдена'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new IsNotFound('Карточка не найдена'));
        return;
      }
      if (e.name === 'CastError') {
        next(new IsCastError('Неккектный ID карточки'));
        return;
      }
      next(new IsServerError('Ошибка сервера'));
    });
};

const dislikeCard = (req, res, next) => {
  const idCard = req.params.cardId;
  Card.findByIdAndUpdate(
    idCard,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new IsNotFound('Карточка не найдена'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new IsNotFound('Карточка не найдена'));
        return;
      }
      if (e.name === 'CastError') {
        next(new IsCastError('Неккектный ID карточки'));
        return;
      }
      next(new IsServerError('Ошибка сервера'));
    });
};

module.exports = {
  getCard,
  createdCard,
  removeCard,
  likeCard,
  dislikeCard,
};
