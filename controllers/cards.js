const Card = require('../models/card');

const createdCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  try {
    if (name === '' || link === '') {
      res.status(400).send('No valid data');
      return;
    }
    Card.create({
      name, link, owner: req.user._id, likes, createdAt,
    });
    res.status(200).send(req.body);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

async function getCard(req, res) {
  const card = await Card.find({});
  try {
    res.status(200).send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

const removeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    Card.findById({ _id: cardId }, (err, card) => {
      if (!card) {
        res.status(404).send('Card not found');
        return;
      }
      card.remove();
      res.status(200).send('OK, Card deleted');
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ message: err.message }, 'No valid ID');
      return;
    }
    res.status(500).send({ message: err.message }, 'Server error');
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
      req.status(404).send('Card not found');
      return;
    }
    res.status(200).send('OK, Add like');
  } catch (err) {
    res.status(500).send({ message: err.message });
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
      req.status(404).send('Card not found');
      return;
    }
    res.status(200).send('OK, Deleted like');
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getCard,
  createdCard,
  removeCard,
  likeCard,
  dislikeCard,
};
