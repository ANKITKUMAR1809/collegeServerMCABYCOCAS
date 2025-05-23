const Faculty = require("../models/facultyModel");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs");



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

exports.facultySignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if faculty already exists
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new faculty
    const newFaculty = new Faculty({
      name,
      email,
      password: hashedPassword,
    });

    await newFaculty.save();

    res.status(201).json({ message: "Faculty registered successfully" });
  } catch (error) {
    console.error("Faculty Signup Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if faculty exists
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //use session to store user data
    req.session.user = {
      id: faculty._id,
      name: faculty.name,
      email: faculty.email,
    };
    req.session.isLoggedIn = true;
    await req.session.save();
    // Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
      },
    });
  } catch (error) {
    console.error("Faculty Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.facultySession = async (req, res) => {
  try {
    if (req.session.user && req.session.isLoggedIn) {
      res.status(200).json({ user: req.session.user });
    } else {
      res.status(401).json({ message: "No active session" });
    }
  } catch (error) {
    console.error("Faculty Session Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.facultyLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return res
          .status(500)
          .json({ message: "Server error. Please try again later." });
      }
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Faculty Logout Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.facultyForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(400).json({ message: "Email not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    faculty.otp = otp.toString();
    await faculty.save();

    const mailOptions = {
      from: `MCA BY COCAS ${process.env.EMAIL_USER}`,
      to: email,
      subject: "Reset Password OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    };

    transporter.sendMail(mailOptions);
    res.status(200).json({message:"OTP sent to your email"});
  } catch (error) {
    res.status(500).json({message:"Server error. Please try again later."});
    console.error("Error in facultyForgetPassword:", error);
  }
};

exports.facultyVerifyOtp = async (req,res)=>{
  const email = req.params.email;
  const { otp } = req.body;
  try {
    const faculty = await Faculty.findOne({email});
    if(!faculty){
      res.status(400).json({message:"Email not found"});
    }
    if(faculty.otp !== otp){
      res.status(400).json({message:"Invalid OTP"});
    }
    faculty.otp = null;
    await faculty.save();
    res.status(200).json({message:"OTP verified successfully"});
  } catch (error) {
    res.status(500).json({message:"Server error. Please try again later."});
    console.error("Error in facultyVerifyOtp:", error);
  }
    
}

exports.facultyResetPassword= async(req,res)=>{
  const email = req.params.email;
  const { password } = req.body;
  try {
    const faculty =await Facutly.findOne({email});
    if(!faculty){
      res.status(400).json({message:"Email not found"});
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    faculty.password = hashedPassword;
    await faculty.save();
    res.status(200).json({message:"Password reset successfully"});
  } catch (error) {
    res.status(500).json({message:"Server error. Please try again later."});
    console.error("Error in facultyResetPassword:",error);
  } 
}
