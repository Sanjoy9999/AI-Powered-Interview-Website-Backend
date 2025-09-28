const jwt = require("jsonwebtoken");
const User = require("../models/user.Model");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  try {
    if (!process.env.JWT_SECRET) {
      // console.error("JWT_SECRET environment variable is missing!");
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; //Extract token from "Bearer <token>"

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found or deleted" });
      }
      
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    // console.error("Auth middleware error:", error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = { protect };
