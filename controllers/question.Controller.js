const Question = require("../models/question.Model");
const Session = require("../models/session.Model");

//@Desc   Add additional questions to an existing session
//@Route  POST /api/questions/add
//@Access Private

exports.addQuestionToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    //Create a new question
    const createQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    //Update session to includes new question IDs
    session.questions.push(...createQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json(createQuestions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//@Desc   Toggle pin/unpin a question
//@Route  POST /api/questions/:id/pin
//@Access Private

exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({success: true , question});
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



//@Desc   Update note for a question
//@Route  POST /api/questions/:id/note
//@Access Private
exports.updateQuestionNote = async (req, res) => {
  try {
      const { note } = req.body;

      const question = await Question.findById(req.params.id);
      if (!question) {
          return res.status(404).json({ message: "Question not found" });
      }

      question.note = note || "";
      await question.save();

      res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
