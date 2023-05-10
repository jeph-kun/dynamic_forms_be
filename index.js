const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//middleware
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//routes
const usersRoute = require("./routes/Users");
const templateRoute = require("./routes/Templates");
const formsRoute = require("./routes/Forms");


app.use("/user", usersRoute);
app.use("/template", templateRoute);
app.use("/form", formsRoute);
mongoose.connect(`${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_DATABASE}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const port = 3001;

app.listen(port, () => {
  console.log("Listening to port: ", port);
});
