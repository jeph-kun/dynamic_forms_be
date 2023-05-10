const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Services
const CreateForms = require('../services/Forms/CreateForm')
const GetForms = require('../services/Forms/GetForms')
const GetFormDetails = require('../services/Forms/GetFormDetails')
const UpdateForm = require('../services/Forms/UpdateForm')


//Authentication Methods
const AuthToken = require("../utils/authToken");



router.post("/create-forms", AuthToken, async (req, res) => {
    const results = await CreateForms(req.body);
  
    if (results) {
      res.status(200).send({
          success: true,
          message: "Form Create Successfully",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "There was a problem saving the form",
      });
    }
});

router.post("/update-form", AuthToken, async (req, res) => {
  const results = await UpdateForm(req.body);

  if (results) {
    res.status(200).send({
        success: true,
        message: "Form Updated Successfully",
    });
  } else {
    res.status(400).send({
      success: false,
      message: "There was a problem updating the form",
    });
  }
});

router.get("/get-forms", AuthToken, async (req, res) => {

  const token = req.header("x-auth-token");
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);



  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;


  const results = await GetForms(skip, limit, req.query.formName, decodedToken.acl.includes('can-view-all-form') ? null : decodedToken.user_id);

  if (results) {

    const formList = results.formList.map((item) => {
        return {
          id: item._id,
          formName: item.formName,
          formTitle: item.formTitle,
          signedAndTotalSignees: `${item.footerFields.filter(user => user.withSignature === true && user.signatureImg !== "").length}/${item.footerFields.filter(user => user.withSignature === true).length}`,  
          createdBy: item.createdBy.fullName,
          status: item.footerFields.filter(user => user.withSignature === true && user.signatureImg !== "").length === item.footerFields.filter(user => user.withSignature === true).length ? 'completed' : 'in-progress'
        }   
    })
    res.status(200).send({
        formList: formList,
        totalResult: results.totalForms
    });
  } else {
    res.status(400).send({
      success: false,
      message: "There was a problem fetching the forms",
    });
  }
});

router.get("/get-form-details/:id", AuthToken, async (req, res) => {
  
  const results = await GetFormDetails(req.params.id);

  if (results) {

    res.status(200).send(results);
    
  } else {
    res.status(400).send({
      success: false,
      message: "There was a problem fetching the forms",
    });
  }
});






module.exports = router;

