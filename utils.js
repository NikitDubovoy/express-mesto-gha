const isNotFound = (res) => {
  res.status(404).send('Not found');
};
const isCastError = (res) => {
  res.status(401).send('No valid data');
};
const isServerError = (res) => {
  res.status(500).send('Server error');
};
const isSuccess = (res, message) => {
  res.status(200).send(message);
};

module.exports = {
  isNotFound,
  isCastError,
  isServerError,
  isSuccess,
};
