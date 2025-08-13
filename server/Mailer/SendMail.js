const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});


const sendMail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text: message
  };
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS:", process.env.MAIL_PASS ? "✅ loaded" : "❌ missing");

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
