const mongoose = require("mongoose");
const Schema = mongoose.Schema; //declare a database structure

const ActiveSession = new Schema({
  //table structure
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("active_sessions", ActiveSession); // "tablename in the db"
