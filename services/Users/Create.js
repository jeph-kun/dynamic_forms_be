const Users = require("../../models/Users");
const MagicLink = require("../../models/MagicLink");
//Authentication Methods
const GenMagicToken = require("../../utils/genMagicToken");
const EncryptPass = require("../../utils/encrpyt");
const { v4: uuidv4 } = require('uuid');
const transporter = require("../Utils/EmailService");

const sendEmails = async(UserData, tokenId) => {
  
  try {

     if(tokenId){
        
        const mailOptions = {
          from: process.env.EMAIL_ADDRESS, // Sender email address
          to: UserData.email, // Recipient email address
          subject: 'SLIVERMOON PORTAL REGISTRATION', // Subject of the email
          html: `<p>Hello ${UserData.firstName}, you have been successfully registered to our portal. You may setup your password by clicking the link below</p></br></br><a href=${`${process.env.FRONT_END_HOST}/auth/login?modal=change-password&token=` + tokenId} target="_blank"><b>Click Here to setup your password</b></a>`, // HTML body of the email
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } 
          else {
            console.log('Email sent:', info.response);
          }
        });
     }
  } catch (error) {
    console.log(error)
  }
}

module.exports = async (userObj) => {


  try {

    const encyptedPass = await EncryptPass(uuidv4()); //Encrypt the Password
    userObj.password = encyptedPass

    const result = await Users.create(userObj)

    if(result){
      const magicToken = GenMagicToken(result._id);
      const response = await MagicLink.create({ token: magicToken })
      sendEmails(result, response._id)

    }
    return true

    
    
  } catch (error) {
    console.error(error)
    return false
  }

};
