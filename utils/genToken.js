const jwt = require("jsonwebtoken");
require("dotenv").config();


const generateToken = (userID, userACL) => {
  const token = jwt.sign(
    { user_id: userID, ...userACL, access_key: process.env.API_ACCESS_KEY },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  return token;
};

module.exports = generateToken;
