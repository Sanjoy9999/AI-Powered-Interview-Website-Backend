const User = require("../models/user.Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate JWT Token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is missing!");
    throw new Error("Server configuration error");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@Desc  Register a new user
//@Route POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;

    //Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    //Return user data with jwt token
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileImageUrl: newUser.profileImageUrl,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

//@Desc  Login a user
//@Route POST /api/auth/login
//@access Public
const loginUser = async (req, res) => {
  try {
    // console.log("Login attempt received");
    
    // Check required config
    if (!process.env.JWT_SECRET) {
      // console.error("JWT_SECRET environment variable missing during login attempt");
      return res.status(500).json({ 
        message: "Server configuration error", 
        details: "Authentication configuration is incomplete" 
      });
    }
    
    const { email, password } = req.body;
    // console.log(`Login attempt for email: ${email}`);

    //Check for user by email
    const user = await User.findOne({ email });
    if (!user) {
      // console.log(`Login failed: No user found with email ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // console.log(`Login failed: Invalid password for ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // console.log(`Login successful for user: ${email}`);
    
    //Return user data with jwt token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });


  } catch (error) {
    // console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

//@Desc  Get user profile
//@Route GET /api/auth/profile
//@access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};



module.exports = { registerUser, loginUser, getUserProfile };
