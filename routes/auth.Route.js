const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/auth.Controller");
const { protect } = require("../middlewares/auth.Middleware");


//Auth Routes
router.post("/register",registerUser); // Register User
router.post("/login",loginUser); // Login User
router.get("/profile",protect,getUserProfile); // Get User Profile


// Cloudinary in-memory image upload (serverless safe)
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "interview-prep-profiles",
    });
    res.json({ imageUrl: result.secure_url });
  } catch (e) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;