const Forms = require("../../models/Forms");

module.exports = async (_id) => {
  try {
    let formDetails = await Forms.findOne({_id});
    return formDetails
  } catch (error) {   
    return false;
  }
};
