const cors = require("cors");
const express = require("express");
const server = express();
require("dotenv").config();
const nodemailer = require("nodemailer");

server.use(cors());
server.use(express.json());

const CLIENT_ID =
  "760858494343-5rak66vm156ksq9g6ni5h14ms5mm0mlp.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04pwjO-DCmPqlCgYIARAAGAQSNwF-L9IrExmlM8wWp8p6WMiteifHX2_OJBp0JTAXmf0Nav5HV-XLNnVf2Shjkh1ASHn_gAXO8ko";

const oAuth2Client = new google.auth.oAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const accessToken = oAuth2Client.getAccessToken();

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // service: "gmail",
  auth: {
    type: "OAuth2",
    user: "process.env.EMAIL_USERNAME",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

server.get("/health", (req, res) => {
  res.send({ message: "Server is working" });
});

server.post("/send", async (req, res, next) => {
  console.log(req.body.name, req.body.message);

  const mailOptions = {
    from: `${req.body.name} <${req.body.email}>`, // Sender address
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
