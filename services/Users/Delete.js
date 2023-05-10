const Users = require("../../models/Users");

module.exports = async (userID) => {
  try {
    await Users.deleteOne({ _id: userID });
    return true;
  } catch (error) {
    return false;
  }
};
