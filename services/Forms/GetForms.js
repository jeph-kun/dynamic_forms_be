const Forms = require("../../models/Forms");

module.exports = async (skip, limit, formName, userID) => {
  try {

  
    const regex = new RegExp(`^${formName}`, 'i');


    let formList = !userID ? await Forms.find(formName.length > 0 ? { formName: { $regex: regex } } : {}).skip(skip).limit(limit) :
                             //RETURN ALL DOCUMENT THAT WAS ONLY TAGGED TO THE USER
                             await Forms.find(formName.length > 0 ? { formName: { $regex: regex }, $or: [{"footerFields.value.value": userID}, {"createdBy.userId": userID}]  } : {$or: [{"footerFields.value.value": userID}, {"createdBy.userId": userID}]}).skip(skip).limit(limit);
    const totalForms = !userID ? await Forms.countDocuments(formName.length > 0 ? { formName: { $regex: regex } } : {}) :
                                 await Forms.countDocuments(formName.length > 0 ? { formName: { $regex: regex }, $or: [{"footerFields.value.value": userID}, {"createdBy.userId": userID}] } : {$or: [{"footerFields.value.value": userID}, {"createdBy.userId": userID}]});
    return { formList, totalForms }
  } catch (error) {
    
    return false;
  }
};
