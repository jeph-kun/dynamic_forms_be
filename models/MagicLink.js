const mongoose = require("mongoose");
const Schema = mongoose.Schema; //declare a database structure

const MagicLink = new Schema({
  //table structure
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("magic_links", MagicLink); // "tablename in the db"
