const mongoose = require("mongoose");
const Schema = mongoose.Schema; //declare a database structure

const UsersSchema = new Schema({
  //table structure
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  position: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  acl: {
    type: [],
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Object,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: Object,
  }
});

module.exports = mongoose.model("users", UsersSchema); // "tablename in the db"
