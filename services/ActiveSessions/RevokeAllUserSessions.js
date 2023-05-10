const ActiveSession = require("../../models/ActiveSession");


module.exports = async (userId) => {

  try {
    
    await ActiveSession.deleteMany({userId})

    return true

  } catch (error) {
    console.error(error)
    return false
  }

};
