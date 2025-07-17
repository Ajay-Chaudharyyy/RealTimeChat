const express = require("express");
const { signUp, login, updateProfile, checkAuth, sendVerificationEmail, changePassword, forgotPassword, sendPasswordResetEmail } = require("../Controller/UserController");
const { protectRoute } = require("../MiddleWare/Auth");
const { getUsersForSideBar, getAllMessages, markMessageAsSeen, sendMessage } = require("../Controller/MessageController");

const router = express.Router();



router.post("/signup",signUp)
router.post("/login",login)
router.post("/changePassword",changePassword)
router.post("/forgotPassword",forgotPassword)
router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);
router.post("/otp",sendVerificationEmail);
router.post("/resetPasswordOtp",sendPasswordResetEmail);

router.get("/users",protectRoute,getUsersForSideBar);
router.get("/users/:id",protectRoute,getAllMessages);
router.put("/users/mark/:id",protectRoute,markMessageAsSeen);
router.post("/users/send/:id",protectRoute,sendMessage);


module.exports = router;