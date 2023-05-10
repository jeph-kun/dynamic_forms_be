const bcrypt = require("bcrypt");

const encrpyt = (password) => {
  const saltRounds = 10;

  const encrypted = bcrypt
    .hash(password, saltRounds)
    .then(function (hash) {
      return hash;
    })
    .catch(() => {
      return false;
    });

  return encrypted;
};

module.exports = encrpyt;
