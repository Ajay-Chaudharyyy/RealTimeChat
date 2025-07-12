const User = require("../Models/User");
const jwt = require("jsonwebtoken");
exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error:err.message });
  }
};
