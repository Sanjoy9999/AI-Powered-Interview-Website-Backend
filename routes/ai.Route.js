const express = require("express");
const { generateInterviewQuestion, generateConceptExplanation } = require("../controllers/ai.Controller");
const { protect } = require("../middlewares/auth.Middleware");

const router = express.Router();

router.post("/generate-questions", protect, generateInterviewQuestion);
router.post("/generate-explanation", protect, generateConceptExplanation);

module.exports = router;