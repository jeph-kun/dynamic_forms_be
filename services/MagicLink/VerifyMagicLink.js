const MagicLink = require("../../models/MagicLink");


module.exports = async (_id) => {
  try {
    const result = await MagicLink.findOne({_id});
    return result;
  } catch (error) {
    return false;
  }
};
