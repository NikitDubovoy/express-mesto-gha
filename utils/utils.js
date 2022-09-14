// eslint-disable-next-line max-classes-per-file
class IsNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class IsCastError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class IsEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class IsServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

class IsSuccess extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200;
  }
}
class InvalidEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class InvalidPassword extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class InvalidAuth extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class InvalidAvatar extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class InvalidLink extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class InvalidRemove extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class InvalidData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

const errorServer = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next(err);
};

module.exports = {
  IsNotFound,
  IsCastError,
  IsServerError,
  IsSuccess,
  InvalidEmail,
  InvalidPassword,
  InvalidAuth,
  InvalidAvatar,
  IsEmail,
  InvalidLink,
  InvalidRemove,
  InvalidData,
  errorServer,
};
