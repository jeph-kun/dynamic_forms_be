const Users = require("../../models/Users");

module.exports = async (email) => {
  try {
    const result = await Users.findOne({ email });
    return result;
  } catch (error) {
    return "Account Not Found";
  }
};
