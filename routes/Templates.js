const express = require("express");
const router = express.Router();

//Services
const GetAllTemplates = require('../services/Templates/GetTemplates')
const GetTemplateDetails = require('../services/Templates/GetTemplateDetails')


//Authentication Methods
const GenToken = require("../utils/genToken");
const AuthToken = require("../utils/authToken");



router.get("/get-templates", AuthToken, async (req, res) => {
    const results = await GetAllTemplates();
  
    if (results) {
      const templateList = results.map((temp) => {
        return {
            value: temp._id,
            label: temp.formTitle,
        }
      })
      res.status(200).send(templateList);
    } else {
      res.status(400).send({
        retrieveStatus: results,
        message: "There must be a problem in the token",
      });
    }
});

router.get("/get-template-details/:id", AuthToken, async (req, res) => {
    const results = await GetTemplateDetails(req.params.id);

    if (results) {
      res.status(200).send(results);
    } else {
      res.status(404).send({
        retrieveStatus: results,
        message: "Cannot find the template",
      });
    }
});




module.exports = router;

