const mongoose = require("mongoose");
const Schema = mongoose.Schema; //declare a database structure

const TemplateSchema = new Schema({
    //table structure
    formTitle: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
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
      type: String,
    },
    updatedAt: {
      type: Date,
    },
    updatedBy: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: String,
    },
    rejectedAt: {
        type: Date,
    },
    rejectedBy: {
      type: String,
    },
    deletedAt: {
        type: Date,
    },
    deletedBy: {
      type: String,
    },
    status: {
      type: String,
      default: 'in-progress'
    }
  });
  
module.exports = mongoose.model("form_templates", TemplateSchema); // "tablename in the db"
  