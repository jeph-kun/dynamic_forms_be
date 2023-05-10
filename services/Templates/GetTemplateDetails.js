const Templates = require("../../models/Templates");
const Users = require("../../models/Users");

module.exports = async (_id) => {
  try {
    const result = await Templates.findOne({_id});
    return result;
  } catch (error) {
    return false;
  }
};
