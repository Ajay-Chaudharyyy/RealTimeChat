const jwt = require("jsonwebtoken");

exports.generateToken = (userId)=>{
    try{
        const token = jwt.sign({userId},process.env.JWT_SECRET);
        return token;
    }catch(err)
    {
        console.log("Error - ",err.message);
    }
}