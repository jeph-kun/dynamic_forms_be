const Template = require("../../models/Templates");

module.exports = async (templateObj) => {
  try {
    await Template.insertMany(templateObj);
    return true;
  } catch (error) {
    return false;
  }
};
