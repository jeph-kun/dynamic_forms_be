const Forms = require("../../models/Forms");
const GetUserInfo = require("../../services/Users/Get");
const transporter = require("../Utils/EmailService");


const sendEmails = async(FormObj) => {
  try {
    
    for(let item = 0; item < FormObj.footerFields.length; item++){
      if(FormObj.footerFields[item].withSignature){
        GetUserInfo(FormObj.footerFields[item].value.value).then(user => {
          const mailOptions = {
            from: process.env.EMAIL_ADDRESS, // Sender email address
            to: user.email, // Recipient email address
            subject: FormObj.formName, // Subject of the email
            html: `<p>You have been tagged as a signatory for an ${FormObj.formTitle} document</p></br></br><a href=${process.env.FRONT_END_HOST + '/forms/view-form/' + FormObj._id} target="_blank"><b>Click Here to redirect to the form in the portal</b></a>`, // HTML body of the email
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
            } 
            else {
              //console.log('Email sent:', info.response);
            }
          });

        })


      }
      
    }
    

  } catch (error) {
    
  }
}

module.exports = async (FormObj) => {
  try {
    delete FormObj._id
    const result = await Forms.create(FormObj);
    sendEmails(result)
    
 

    return true;
  } catch (error) {
    console.error(error)
    return false;
  }
};
