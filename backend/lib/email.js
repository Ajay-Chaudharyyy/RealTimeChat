// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Only needed if using .env

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (receiver, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receiver,
    subject: subject,
    text: "",
    html:html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;
