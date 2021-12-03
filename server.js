const cors = require("cors");
const express = require("express");
const server = express();
require("dotenv").config();
const nodemailer = require("nodemailer");

server.use(cors());
server.use(express.json());

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

server.post("/send", async (req, res, next) => {
  console.log(req.body.name, req.body.message);

  const mailOptions = {
    from: req.body.email, // Sender address
    to: "mathews.davidb@gmail.com", // List of recipients
    subject: "Message from Your Portfolio Site", // Subject line
    text: `from Name: ${req.body.name} - Email: ${req.body.email} - Message: ${req.body.message}`, // Plain text body
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running!`);
});
