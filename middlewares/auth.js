const jwt = require('jsonwebtoken');
const InvalidAuth = require('../errors/InvalidAuth');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new InvalidAuth('Ошибка авторизации'));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (e) {
      next(new InvalidAuth('Необходимо авторизироваться'));
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;
