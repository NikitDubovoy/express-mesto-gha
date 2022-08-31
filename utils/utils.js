const isNotFound = (res) => {
  res.status(404).send({ message: 'Not Found' });
};
const isCastError = (res, data) => {
  res.status(400).send({ message: data });
};

const isServerError = (res, data) => {
  res.status(500).send({ message: data });
};
const isSuccess = (res, data) => {
  res.status(200).send({ message: data });
};

module.exports = {
  isNotFound,
  isCastError,
  isServerError,
  isSuccess,
};
