const Users = require("../../models/Users");

module.exports = async (_id, email) => {
  try {
    const result = _id ? await Users.findOne({ _id }) : await Users.findOne({ email });
    return result;
  } catch (error) {
    return false
  }
};
