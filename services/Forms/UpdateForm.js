const Forms = require("../../models/Forms");


module.exports = async (FormObj) => {
  try {
    FormObj.updatedAt = Date.now();
    const _id = FormObj._id
    delete FormObj._id
    await Forms.updateOne({_id},FormObj)

    return true;
  } catch (error) {
    console.error(error)
    return false;
  }
};
