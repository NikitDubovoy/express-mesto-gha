const isNotFound = (res) => {
  res.status(404).send({ message: 'Not Found' });
};
const isCastError = (res, data) => {
  res.status(400).send({ message: data });
};

const isEmail = (res, data) => {
  res.status(409).send({ message: data });
};

const isServerError = (res, data) => {
  res.status(500).send({ message: data });
};
const isSuccess = (res, data) => {
  res.status(200).send({ message: data });
};

const invalidEmail = (res) => {
  res.status(400).send({ message: 'invalid email' });
};

const invalidPassword = (res) => {
  res.status(400).send({ message: 'invalid Password' });
};

const invalidData = (res) => {
  res.status(401).send({ message: 'invalid password or email' });
};

const invalidAuth = (res) => {
  res.status(401).send({ message: 'Need authorization' });
};

const invalidAvatar = (res) => {
  res.status(400).send({ message: 'invalid Avatar' });
};

module.exports = {
  isNotFound,
  isCastError,
  isServerError,
  isSuccess,
  invalidEmail,
  invalidPassword,
  invalidData,
  invalidAuth,
  invalidAvatar,
  isEmail,
};
