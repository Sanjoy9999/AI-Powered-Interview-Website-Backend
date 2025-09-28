require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.Route");
const sessionRoutes = require("./routes/session.Route");
const questionRoutes = require("./routes/question.Route");
const { protect } = require("./middlewares/auth.Middleware");
const {
  generateInterviewQuestion,
  generateConceptExplanation,
} = require("./controllers/ai.Controller");
const mongoose = require("mongoose");

let isConnected = false;

const app = express();




const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(`Error in DB connection ${error}`);
    // If there is an error in connecting to the database, exit the process with failure
    process.exit(1);
  }
};

// Connect to Database
app.use((req, res, next) => {
  if (!isConnected) {
    connectDB();
  }
  next();
});

//Middleware
app.use(express.json());

// Middleware to handle CORS
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestion);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

//Server uploads folders
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

//Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


//do not use app.listen when using serverless functions like vercel
//instead export the app
module.exports = app;