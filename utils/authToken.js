const jwt = require("jsonwebtoken");
const GetSession = require("../services/ActiveSessions/GetSession");

require("dotenv").config();

const authToken = async(req, res, next) => {
  const token = req.header("x-auth-token");


  //Check if the token is valid
  if(!token){
    res
      .status(401)
      .send({ message: "Unauthorized Access: Please login to proceed" });
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const result = await GetSession(decodedToken.user_id)

      if(result){
        req.user = decodedToken;
        next();
      } else {
        res.status(401).send({ message: "No Valid Session found" });
      }

    } catch (error) {
      res.status(401).send({ message: "BAD TOKEN" });
    }
  }

};

module.exports = authToken;
