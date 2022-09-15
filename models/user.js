const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив Кусто',
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    match: /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z0-9][A-Za-z0-9.\-_]*[A-Za-z0-9]*@([A-Za-z0-9]+([A-Za-z0-9-]*[A-Za-z0-9]+)*\.)+[A-Za-z]*$/,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
