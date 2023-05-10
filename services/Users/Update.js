const Users = require("../../models/Users");

module.exports = async (userID, updatedInfo, isUpdatedByAdmin) => {
  try {
    updatedInfo.updatedAt = Date.now()

    if(!isUpdatedByAdmin){
      updatedInfo.updatedBy = {
        userId: userID,
        fullName: updatedInfo.firstName + " " + updatedInfo.lastName
      }
    }


    await Users.updateOne({ _id: userID }, { $set: updatedInfo });
    return true;
  } catch (error) {
    return false;
  }
};
