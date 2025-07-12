const { generateToken } = require("../lib/Utils");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/Cloudinary");


exports.signUp = async(req,res) => {
    console.log("Sign up route envoked");
    try{
        const {fullName, email, password,bio} = req.body;
        if(!fullName || !email || !password || !bio)
        {
            return res.status(400).json({
                success:false,
                message:"Missing Details"
            })
        }

        const user = await User.findOne({email});
        if(user)
        {
         return res.status(400).json({
                success:false,
                message:"Account already exists"
            })   
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser=  await User.create({fullName,email,bio,password:hashedPassword});

        //create token
        const token = generateToken(newUser._id);

        return res.status(200).json({
            success:true,
            data:newUser,
            token,
            message:"Account Created Successfully"
        })

    }catch(err)
    {
        res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:err.message
        })
    }
}

exports.login = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please share all the required details"
            })
        }
        const user = await User.findOne({email});
        if(!user)
        {
           return res.status(400).json({
                success:false,
                message:"Please Sign Up first"
            }) 
        }

        if(!await bcrypt.compare(password, user.password))
        {
            return res.status(401).json({
                success:false,
                message:"Wrong Password"
            })
        }

        const token = generateToken(user._id);
        return res.status(200).json({
            success:true,
            data:user,
            token,
            message:"User Logged in Successfully"
        })
    }catch(err)
    {
        res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:err.message
        })
    }
}

exports.checkAuth= (req,res) =>{
    try{res.json({success:true,user:req.user});}
    catch(err){res.json({success:false,message:err.message});}
    
}


exports.updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      // Just upload base64 directly — SDK will sign internally
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "user-profiles",
        resource_type: "auto", // handles image or video
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName, profilePic: upload.secure_url },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
