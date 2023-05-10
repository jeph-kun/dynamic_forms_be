const express = require("express");
const router = express.Router();

//Database Functions
const CreateService = require("../services/Users/Create");
const GetUserInfo = require("../services/Users/Get");
const LoginUser = require("../services/Users/Login");
const UpdateService = require("../services/Users/Update");
const DeleteService = require("../services/Users/Delete");
const GetAllUsers = require("../services/Users/GetAllUsers");
const GetAllUsersConso = require("../services/Users/GetAllUsersConso");
const VerifyMagicLink = require("../services/MagicLink/VerifyMagicLink")
const DeleteMagicLink = require("../services/MagicLink/DeleteMagicLink")
const transporter = require("../services/Utils/EmailService");
const MagicLink = require("../models/MagicLink");
//Authentication Methods
const GenMagicToken = require("../utils/genMagicToken");
//Sessions
const CreateSession = require("../services/ActiveSessions/CreateSession");


//Encryption Methods
const EncryptPass = require("../utils/encrpyt");
const DecryptPass = require("../utils/decrypt");

//Authentication Methods
const GenToken = require("../utils/genToken");
const AuthToken = require("../utils/authToken");

const jwt = require("jsonwebtoken");
const RevokeAllUserSessions = require("../services/ActiveSessions/RevokeAllUserSessions");

//@PUBLIC ROUTES
router.post("/create", AuthToken, async (req, res) => {
  const { userOBJ } = req.body;
  //const encyptedPass = await EncryptPass(userOBJ.password); //Encrypt the Password

    const results = await CreateService(userOBJ);

    if (results) {
      res.status(200).send({
        status: results,
        message: "Account Created",
      });
    } else {
      res.status(500).send({
        status: results,
        message: "There was a problem adding the account",
      });
    }

});

router.post("/login", async (req, res) => {
  const {
    userOBJ: { email, password },
  } = req.body;

  const results = await LoginUser(email);

  if (results && results.isActive) {
    //decrypt the password from db and compare //return boolean
    const decryptedPass = await DecryptPass(password, results.password);
    
    
    

    if (decryptedPass) {
      //Generate Token
      const userToken = GenToken(results._id, { acl: results.acl, isAdmin: results.isAdmin});
      //Create Session
      await CreateSession(results._id)

      //Check if the GenToken was successfull
      !userToken
        ? res.status(500).send({ message: "Cannot Create a Token" })
        : res.status(200).send({
            token: userToken,
            user_info: {
              _id: results._id,
              userEmail: results.email,
              position: results.position,
              fullName: results.firstName + " " + results.lastName,
              acl: results.acl,
              isAdmin: results.isAdmin
            },
          });
    } else {
      res.status(401).send({ message: "Invalid Credentials" });
    }
  } else {
    res.status(401).send({
      message: "Cannot find user or the account has been deactivated",
    });
  }
});

//@PRIVATE ROUTES

router.post("/delete", AuthToken, async (req, res) => {
  const { userID } = req.body;

  const results = await DeleteService(userID);

  if (results) {
    res.status(200).send({
      status: results,
      message: "User was deleted",
    });
  } else {
    res.status(500).send({
      status: results,
      message: "There was an error deleting the user",
    });
  }
});

router.post("/update", async (req, res) => {
  const { userID, updatedInfo } = req.body;

  const results = await UpdateService(userID, updatedInfo);

  if (results) {
    res.status(200).send({
      status: results,
      message: "Update Successfull",
    });
  } else {
    res.status(500).send({
      status: results,
      message: "There was an error updating",
    });
  }
});

router.post("/update-profile", AuthToken, async (req, res) => {
  try {
    const { userID, updatedInfo } = req.body;

    let userData = await GetUserInfo(userID, null);
  
    userData.email = updatedInfo.email;
    userData.password = updatedInfo.password.length > 0 ? await EncryptPass(updatedInfo.password) : userData.password;
    userData.firstName = updatedInfo.firstName;
    userData.lastName = updatedInfo.lastName;
    userData.position = updatedInfo.position;
    
  
    const results = await UpdateService(userID, userData);
  
    if (results) {
      res.status(200).send({
        status: results,
        message: "Update Profile Successfull",
      });
    } else {
      res.status(500).send({
        status: results,
        message: "There was an error updating",
      });
    }
  
  } catch (error) {
    res.status(500).send({
      status: results,
      message: "There was an error updating",
    });

  }
});

router.post("/update-user", AuthToken, async (req, res) => {
  try {
    const { userID, updatedInfo } = req.body;

    let userData = await GetUserInfo(userID, null);
  
    userData.email = updatedInfo.email;
    userData.firstName = updatedInfo.firstName;
    userData.lastName = updatedInfo.lastName;
    userData.position = updatedInfo.position;
    userData.isAdmin = updatedInfo.isAdmin;
    userData.isActive = updatedInfo.isActive;
    userData.acl = updatedInfo.acl;
    userData.updatedBy = updatedInfo.updatedBy;
    
  
    const results = await UpdateService(userID, userData, true);
  
    if (results) {
      //REVOKE ALL USER SESSION TO LOGOUT
      await RevokeAllUserSessions(userID);
      res.status(200).send({
        status: results,
        message: "Update user Successfull",
      });
    } else {
      res.status(500).send({
        status: results,
        message: "There was an error updating",
      });
    }
  
  } catch (error) {
    res.status(500).send({
      status: results,
      message: "There was an error updating",
    });

  }
});

router.get("/get_user_info/:id",AuthToken, async (req, res) => {
  const results = await GetUserInfo(req.params.id, null);

  if (results) {
    delete results.password
    res.status(200).send(results);
  } else {
    res.status(400).send({
      retrieveStatus: results,
      message: "Bad Request",
    });
  }
});

router.get("/get_user_acl/:id",AuthToken, async (req, res) => {
  const results = await GetUserInfo(req.params.id, null);

  if (results) {
    res.status(200).send({
       acl: results.acl,
       isAdmin: results.isAdmin
    });
  } else {
    res.status(400).send({
      retrieveStatus: results,
      message: "Bad Request",
    });
  }
});

router.get("/get-users", AuthToken, async (req, res) => {
  const results = await GetAllUsers();

  if (results && results.length > 0) {
    const userList = results.map((user) => {
       return {
          value: user._id,
          label: user.firstName + " " + user.lastName + ` (${user.position})`
       }
    })
    res.status(200).send(userList);
  } else {
    res.status(404).send({
      retrieveStatus: results,
      message: "Cannot find user/s",
    });
  }
});

router.get("/get-users-conso", AuthToken, async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;


  const results = await GetAllUsersConso(skip, limit, req.query.name);

  if (results) {
    const userList = results.userList.map((user) => {
       return {
          id: user._id,
          fullName: user.firstName + " " + user.lastName,
          position: user.position,
          email: user.email,
          isActive: user.isActive
       }
    })
    res.status(200).send({
      userList: userList,
      totalUsers: results.totalUsers
    });
  } else {
    res.status(404).send({
      retrieveStatus: results,
      message: "Cannot find user/s",
    });
  }
});

// PASSWORD SETUP
router.get("/verify-magic-link/:token", async (req, res) => {
  

  const results = await VerifyMagicLink(req.params.token);

  if (results?.token) {
    try {
      const decodedToken = jwt.verify(results?.token, process.env.JWT_SECRET);
      const { user_id } = decodedToken;

      if(user_id && user_id.length > 0) {
         res.status(200).send(user_id);
         //DELETE THE TOKEN FROM DB
      } else {
         
         res.status(400).send({ message: "BAD TOKEN" });
         //DELETE THE TOKEN FROM DB

      }

    } catch (error) {
      console.log(error)
      res.status(400).send({ message: "BAD TOKEN" });
    }
    
  } else {
    res.status(404).send({
      retrieveStatus: results,
      message: "Magic link already used",
    });
  }
});

router.post("/setup-password", async (req, res) => {
  try {
    const { userID, password, tokenId } = req.body;

    const userData = await GetUserInfo(userID);

    if(userData){
      delete userData._id
      userData.password = await EncryptPass(password); //Encrypt the Password
      const results = await UpdateService(userID, userData);
  
      if (results) {
        await DeleteMagicLink(tokenId)
        res.status(200).send({
          status: results,
          message: "Password Changed Successfully",
        });
      } else {
        res.status(500).send({
          status: results,
          message: "There was a problem changin the password",
        });
      }

    } else {
      res.status(404).send({
        status: results,
        message: "Cannot find user",
      });
    }
    
  } catch (error) {
    res.status(500).send({
      status: results,
      message: "There was an error seting up the password",
    });
  }

});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const userData = await GetUserInfo(null, email);

    if(userData && userData.isActive){

          const magicToken = GenMagicToken(userData._id, '1h');
          const response = await MagicLink.create({ token: magicToken })


          if(response){
            
            const mailOptions = {
              from: process.env.EMAIL_ADDRESS, // Sender email address
              to: userData.email, // Recipient email address
              subject: 'Forgot Password', // Subject of the email
              html: `<p>Hello ${userData.firstName}, you have requested to make a change to your current password in the portal.</p></br></br><a href=${`${process.env.FRONT_END_HOST}/auth/login?modal=change-password&token=` + response._id} target="_blank"><b>Click Here to change your password</b></a>`, // HTML body of the email
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(error);
              } 
              else {
                res.status(200).send({
                  status: true,
                  message: "Reset Link successfully sent",
                });
                //console.log('Email sent:', info.response);
              }
            });
          }

    } else {
      res.status(404).send({
        message: "Cannot find user",
      });
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "There was an error seting up the password",
    });
  }

});

//SESSIONS
router.post("/revoke-all-sessions", AuthToken, async (req, res) => {
  try {
    const { userID } = req.body;

  
    const results = await RevokeAllUserSessions(userID);
  
    if (results) {
      //force logout
      res.status(200).send({
        status: results,
      });
    } else {
      res.status(500).send({
        status: results,
        message: "There was a problem revoking the user",
      });
    }
  
  } catch (error) {
    res.status(500).send({
      status: results,
      message: "There was a problem revoking the user",
    });

  }
});




module.exports = router;
