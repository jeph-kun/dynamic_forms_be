const Users = require("../../models/Users");

module.exports = async () => {
  try {
    const result = await Users.find({});
    return result;
  } catch (error) {
    return false;
  }
};
