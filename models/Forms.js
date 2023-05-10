const mongoose = require("mongoose");
const Schema = mongoose.Schema; //declare a database structure

const FormsSchema = new Schema({
    //table structure
    formName: {
      type: String,
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: false,
      default: ""
    },
    headingFields: {
      type: [],
      required: true,
    },
    footerFields: {
      type: [],
      required: true,
    },
    tableColumns: {
      type: [],
    },
    "tableColumns-two": {
      type: [],
    },
    breakdown: {
      type: [],
    },
    "breakdown-two": {
      type: [],
    },
    columnsWithTotal: {
      type: [],
    },
    clientSignedFileUrl: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: {},
    },
    updatedAt: {
      type: Date,
    },
    updatedBy: {
      type: {},
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: {},
    },
    rejectedAt: {
        type: Date,
    },
    rejectedBy: {
      type: {},
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: {},
    },
    status: {
      type: String,
      default: 'in-progress'
    }
  });
  
module.exports = mongoose.model("forms", FormsSchema); // "tablename in the db"
  