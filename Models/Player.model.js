const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const EMAIL_PATTERN =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const playerSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es requerido"],
    unique: true,
    match: [EMAIL_PATTERN, "Por favor, introduce un correo electrónico válido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
    match: [PASSWORD_PATTERN, "La contraseña debe contener al menos 8 dígitos"],
  },
  active: {
    type: Boolean,
    default: false
  },
  googleID: {
    type: String
  },
  city: {
    type: String,
    required: [true, "Por favor introduce tu ciudad"],
  },
  avatar: {
    type: String,
    default: "https://static.thenounproject.com/png/5034901-200.png",
  },
  birthday: {
    type: Date
  }
});

playerSchema.pre("save", function (next) {

  if (this.isModified("password")) {
    bcrypt
      .hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

playerSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
