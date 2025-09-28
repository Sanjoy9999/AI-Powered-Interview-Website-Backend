require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import from config/db.js

const authRoutes = require("./routes/auth.Route");
const questionRoutes = require("./routes/question.Route");
const sessionRoutes = require("./routes/session.Route");

const app = express();

// CORS Configuration - Direct implementation
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://interview-prep-ai-rust-nine.vercel.app',
    'http://localhost:5173', // Vite default
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.json({ message: "AI Interview Backend API is running!" });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;