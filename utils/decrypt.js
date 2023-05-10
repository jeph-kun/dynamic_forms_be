const bcrypt = require("bcrypt");

const decrypt = (inputPass, hashedPass) => {
  const decrpyted = bcrypt
    .compare(inputPass, hashedPass)
    .then(function (result) {
      return result;
    });

  return decrpyted;
};

module.exports = decrypt;
