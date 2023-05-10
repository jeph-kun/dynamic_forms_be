const ActiveSession = require("../../models/ActiveSession");


module.exports = async (userId) => {

  try {
    
    const result = await ActiveSession.find({userId})

    return result.length > 0 ? true : false

  } catch (error) {
    console.error(error)
    return false
  }

};
