const jwt = require('jsonwebtoken');
const Error = require('../utils/utils');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    Error.invalidAuth(res);
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      next(err);
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;
