const Templates = require("../../models/Templates");
const Users = require("../../models/Users");

module.exports = async () => {
  try {
    const result = await Templates.find({});
    return result;
  } catch (error) {
    return false;
  }
};
