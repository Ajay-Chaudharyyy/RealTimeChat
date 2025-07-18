const { generateToken } = require("../lib/Utils");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/Cloudinary");
const sendEmail = require("../lib/email");

const VerificationToken = require("../Models/VerificationToken");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const getWelcomeEmailHTML = (fullName, otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #3b82f6;">Welcome to NexTalk, ${fullName} 👋</h2>
      <p style="font-size: 16px; color: #333;">Here's your OTP to complete registration:</p>
      <div style="font-size: 20px; font-weight: bold; background: #f1f5f9; padding: 10px; border-radius: 5px; display: inline-block;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #666; margin-top: 20px;">This OTP will expire in 5 minutes.</p>
      <p style="font-size: 16px; color: #333;">Best regards,<br/>The NexTalk Team</p>
    </div>
  </div>
`;
const getPasswordResetEmailHTML = (fullName, otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #ef4444;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #333;">Hi ${fullName},</p>
      <p style="font-size: 16px; color: #333;">We received a request to reset your password. Use the OTP below to proceed:</p>
      <div style="font-size: 22px; font-weight: bold; background: #fef2f2; color: #dc2626; padding: 12px 20px; border-radius: 6px; display: inline-block; margin-top: 10px;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #666; margin-top: 20px;">This OTP will expire in 10 minutes. If you didn’t request a password reset, you can safely ignore this email.</p>
      <p style="font-size: 16px; color: #333;">Stay secure,<br/>The NexTalk Team</p>
    </div>
  </div>
`;




exports.changePassword = async (req,res) => {
  try{
    console.log("Entering in changePassword controller👏👏👏👏")
    const {oldPassword, newPassword} = req.body;

    if(!newPassword || !oldPassword)
    {
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    };
    console.log("UserId : 😊😊😂", req?.user?._id);
    const userId = req.user._id;
    
    const verify = await User.findById(userId);
    if(!verify)
    {
      return res.status(400).json({
        success:false,
        message:"User Not Found"
      })
    }

    if(!await bcrypt.compare(oldPassword,verify.password))
    {
      return res.status(400).json({
        success:false,
        message:"Old password is not correct"
      })
    }
    if(await bcrypt.compare(newPassword,verify.password))
    {
      return res.status(400).json({
        success:false,
        message:"Your password is Same as your old one, please provide new one"
      })
    }


    const password = await bcrypt.hash(newPassword,10);
    const user = await User.findByIdAndUpdate(userId,{password},{new:true});

    res.status(200).json({
      success:true,
      message:"Password Changed Successfully!"
    })


  } catch(err)
  {
    res.status(500).json({
      success:false,
      message:"Internal Server Error",
      error:err.message
    })
  }
}

exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Missing Details"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account does not exists"
      });
    }
    const fullName = user.fullName;

    const otp = generateOTP();
    const htmlBody = getPasswordResetEmailHTML(fullName, otp);

    // Send email
    const emailSent = await sendEmail(email, `Welcome to NexTalk`, htmlBody);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: "Email sending failed" });
    }

    // Upsert OTP
    await VerificationToken.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

exports.forgotPassword = async (req,res) => {
 
  try{
    const {email,password,confirmPassword,otp} = req.body;
    if(!email || !password || !confirmPassword || !otp)
    {
      return res.status(400).json({
        success:false,
        message:"Please fill all the required Details"
      })
    }
    if(password !== confirmPassword)
    {
      return res.status(400).json({
        success:false,
        message:"Passwords do not match"
      })
    }

    if(!otp)
       {
      return res.status(400).json({
        success:false,
        message:"OTP is Invalid"
      })
    }
    const verifyOtp = await VerificationToken.findOne({otp});
    if(!verifyOtp)
    {
       {
      return res.status(400).json({
        success:false,
        message:"OTP is incorrect"
      })
    }
    }
    const user = await User.findOne({email});

    if(!user)
    {
      return res.status(400).json({
        success:false,
        message:"Passwords do not match"
      })
    }
    const hashedPassword = await bcrypt.hash(password,10);

    await User.findByIdAndUpdate(user._id,{password:hashedPassword},{new:true});

    return res.status(200).json({
      success:true,
      message:"Password updated successfully"
    })
  }
  catch(err)
  {
    res.status(500).json({
      success:false,
      message:"Internal Server Error",
      error:err.message
    })
  }
}


exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Missing Details"
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Account already exists"
      });
    }

    const otp = generateOTP();
    const htmlBody = getWelcomeEmailHTML(fullName, otp);

    // Send email
    const emailSent = await sendEmail(email, `Welcome to NexTalk`, htmlBody);
    if (!emailSent) {
      return res.status(500).json({ success: false, message: "Email sending failed" });
    }

    // Upsert OTP
    await VerificationToken.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};


exports.signUp = async (req, res) => {
  console.log("Sign up route invoked");
  try {
    const { fullName, email, password, bio, otp } = req.body;
    console.log(password," My sign up password ");

    if (!fullName || !email || !password || !bio || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields including OTP are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Account already exists"
      });
    }

    const validOtpEntry = await VerificationToken.findOne({ email });
    if (!validOtpEntry || validOtpEntry.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      fullName,
      email,
      bio,
      password: hashedPassword
    });

    // Delete used OTP
    await VerificationToken.deleteOne({ email });

    // Generate token
    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      data: newUser,
      token,
      message: "Account created successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};


exports.login = async(req,res) => {
    try{
        const {email,password} = req.body;
        console.log("My Login Password - ", password)
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
