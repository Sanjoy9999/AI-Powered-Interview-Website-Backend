const express = require("express");
const {togglePinQuestion,updateQuestionNote,addQuestionToSession} = require("../controllers/question.Controller");
const { protect } = require("../middlewares/auth.Middleware");

const router = express.Router();

router.post("/add",protect,addQuestionToSession);
router.post("/:id/pin",protect,togglePinQuestion);
router.post("/:id/note",protect,updateQuestionNote);

module.exports = router;