const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },  // Email trying to sign up
  otp: { type: String, required: true },                   // 6-digit OTP
  createdAt: { type: Date, default: Date.now, expires: 300 } // TTL: auto deletes after 5 mins
});

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
