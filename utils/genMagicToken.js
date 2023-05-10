const jwt = require("jsonwebtoken");
require("dotenv").config();


const generateMagicToken = (userID, expiresIn) => {
  const token = jwt.sign(
    { user_id: userID, access_key: process.env.API_ACCESS_KEY },
    process.env.JWT_SECRET,
    {
      expiresIn: expiresIn ? expiresIn : "24h",
    }
  );

  return token;
};

module.exports = generateMagicToken;
